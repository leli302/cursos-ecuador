const { query, getClient } = require('../config/database');
const { paginate, paginatedResponse } = require('../utils/helpers');

// ============================================
// NIVELES DE COMISIÓN (ADMIN)
// ============================================

// GET /api/commissions/levels
const getCommissionLevels = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM niveles_comision ORDER BY orden ASC'
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// PUT /api/commissions/levels/:id
const updateCommissionLevel = async (req, res, next) => {
  try {
    const { porcentaje_comision, min_estudiantes, min_certificados,
            min_calificacion, min_tasa_finalizacion, min_resenas, activo } = req.body;

    const result = await query(
      `UPDATE niveles_comision SET
        porcentaje_comision = COALESCE($1, porcentaje_comision),
        min_estudiantes = COALESCE($2, min_estudiantes),
        min_certificados = COALESCE($3, min_certificados),
        min_calificacion = COALESCE($4, min_calificacion),
        min_tasa_finalizacion = COALESCE($5, min_tasa_finalizacion),
        min_resenas = COALESCE($6, min_resenas),
        activo = COALESCE($7, activo),
        actualizado_en = NOW()
       WHERE id = $8 RETURNING *`,
      [porcentaje_comision, min_estudiantes, min_certificados,
       min_calificacion, min_tasa_finalizacion, min_resenas, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nivel no encontrado.' });
    }

    res.json({ message: 'Nivel actualizado correctamente.', level: result.rows[0] });
  } catch (error) { next(error); }
};

// ============================================
// DASHBOARD DEL INSTRUCTOR
// ============================================

// GET /api/commissions/instructor
const getInstructorCommissions = async (req, res, next) => {
  try {
    const instructorId = req.user.id;

    // 1. Obtener los cursos del instructor con métricas calculadas
    const coursesResult = await query(
      `SELECT 
        c.id, c.nombre, c.imagen, c.total_ventas, c.valoracion, c.estado,
        
        -- Estudiantes inscritos
        (SELECT COUNT(*) FROM inscripciones WHERE curso_id = c.id AND estado = 'activa') as total_estudiantes,
        
        -- Certificados emitidos
        (SELECT COUNT(*) FROM certificados WHERE curso_id = c.id AND estado = 'activo') as total_certificados,
        
        -- Calificación promedio
        (SELECT COALESCE(AVG(calificacion), 0) FROM resenas WHERE curso_id = c.id) as calificacion_promedio,
        
        -- Reseñas positivas (>=4)
        (SELECT COUNT(*) FROM resenas WHERE curso_id = c.id AND calificacion >= 4) as resenas_positivas,
        
        -- Total reseñas
        (SELECT COUNT(*) FROM resenas WHERE curso_id = c.id) as total_resenas,
        
        -- Tasa de finalización
        (SELECT 
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            (COUNT(*) FILTER (WHERE pu.porcentaje >= 100)::DECIMAL / COUNT(*)) * 100, 2
          ) END
         FROM progreso_usuario pu WHERE pu.curso_id = c.id
        ) as tasa_finalizacion,
        
        -- Datos de comisión actual
        cc.id as comision_id,
        cc.porcentaje_actual,
        cc.bonus_temporal,
        cc.ganancias_acumuladas,
        cc.nivel_id,
        nc.nombre as nivel_nombre,
        nc.color as nivel_color,
        nc.icono as nivel_icono,
        nc.orden as nivel_orden
        
       FROM cursos c
       LEFT JOIN comision_cursos cc ON c.id = cc.curso_id
       LEFT JOIN niveles_comision nc ON cc.nivel_id = nc.id
       WHERE c.instructor_id = $1
       ORDER BY c.creado_en DESC`,
      [instructorId]
    );

    // 2. Obtener todos los niveles para calcular progreso
    const levelsResult = await query(
      'SELECT * FROM niveles_comision WHERE activo = true ORDER BY orden ASC'
    );

    // 3. Calcular métricas globales
    const globalStats = await query(
      `SELECT 
        COALESCE(SUM(hc.monto_comision), 0) as ganancias_totales,
        COALESCE(SUM(hc.monto_comision) FILTER (
          WHERE hc.creado_en >= DATE_TRUNC('month', CURRENT_DATE)
        ), 0) as ganancias_mes,
        COUNT(DISTINCT hc.curso_id) as cursos_con_ventas
       FROM historial_comisiones hc
       WHERE hc.instructor_id = $1`,
      [instructorId]
    );

    // 4. Ganancias mensuales (últimos 12 meses)
    const monthlyEarnings = await query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('month', creado_en), 'YYYY-MM') as mes,
        TO_CHAR(DATE_TRUNC('month', creado_en), 'Mon YYYY') as mes_label,
        SUM(monto_comision) as total,
        COUNT(*) as ventas
       FROM historial_comisiones
       WHERE instructor_id = $1 AND creado_en >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', creado_en)
       ORDER BY DATE_TRUNC('month', creado_en) ASC`,
      [instructorId]
    );

    // 5. Promociones activas que aplican a este instructor
    const promotions = await query(
      `SELECT * FROM promociones_comision
       WHERE activa = true
         AND fecha_inicio <= CURRENT_DATE
         AND fecha_fin >= CURRENT_DATE
         AND (tipo = 'global' OR (tipo = 'instructor' AND target_id = $1))
       ORDER BY porcentaje_bonus DESC`,
      [instructorId]
    );

    // También obtener promociones por curso
    const courseIds = coursesResult.rows.map(c => c.id);
    let coursePromotions = [];
    if (courseIds.length > 0) {
      const coursePromosResult = await query(
        `SELECT * FROM promociones_comision
         WHERE activa = true
           AND fecha_inicio <= CURRENT_DATE
           AND fecha_fin >= CURRENT_DATE
           AND tipo = 'curso'
           AND target_id = ANY($1::int[])`,
        [courseIds]
      );
      coursePromotions = coursePromosResult.rows;
    }

    // 6. Enriquecer cada curso con próximo nivel y progreso
    const levels = levelsResult.rows;
    const courses = coursesResult.rows.map(course => {
      const currentLevelOrder = course.nivel_orden || 0;
      const nextLevel = levels.find(l => l.orden > currentLevelOrder) || null;

      let progress = null;
      if (nextLevel) {
        const metrics = {
          estudiantes: { current: parseInt(course.total_estudiantes), required: nextLevel.min_estudiantes },
          certificados: { current: parseInt(course.total_certificados), required: nextLevel.min_certificados },
          calificacion: { current: parseFloat(course.calificacion_promedio), required: parseFloat(nextLevel.min_calificacion) },
          finalizacion: { current: parseFloat(course.tasa_finalizacion), required: parseFloat(nextLevel.min_tasa_finalizacion) },
          resenas: { current: parseInt(course.resenas_positivas), required: nextLevel.min_resenas }
        };

        // Calcular progreso general: promedio de cada métrica (capped at 100%)
        const metricProgress = Object.values(metrics).map(m =>
          m.required === 0 ? 100 : Math.min(100, (m.current / m.required) * 100)
        );
        const overallProgress = metricProgress.reduce((a, b) => a + b, 0) / metricProgress.length;

        progress = {
          nextLevel: { nombre: nextLevel.nombre, color: nextLevel.color, porcentaje: nextLevel.porcentaje_comision },
          metrics,
          overallProgress: Math.round(overallProgress)
        };
      }

      // Asignar promociones específicas de este curso
      const appliedPromotions = coursePromotions.filter(p => p.target_id === course.id);

      return {
        ...course,
        progress,
        appliedPromotions
      };
    });

    res.json({
      stats: {
        gananciasTotales: parseFloat(globalStats.rows[0].ganancias_totales),
        gananciasMes: parseFloat(globalStats.rows[0].ganancias_mes),
        cursosConVentas: parseInt(globalStats.rows[0].cursos_con_ventas),
        totalCursos: coursesResult.rows.length
      },
      courses,
      levels,
      monthlyEarnings: monthlyEarnings.rows,
      promotions: promotions.rows
    });
  } catch (error) { next(error); }
};

// ============================================
// HISTORIAL DE COMISIONES
// ============================================

// GET /api/commissions/history
const getCommissionHistory = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const isAdmin = req.user.roles.includes('administrador');
    const instructorId = isAdmin && req.query.instructorId ? req.query.instructorId : req.user.id;

    let where = [];
    let params = [];
    let idx = 1;

    if (!isAdmin || req.query.instructorId) {
      where.push(`hc.instructor_id = $${idx}`);
      params.push(instructorId);
      idx++;
    }
    if (req.query.cursoId) {
      where.push(`hc.curso_id = $${idx}`);
      params.push(req.query.cursoId);
      idx++;
    }
    if (req.query.mes) {
      where.push(`TO_CHAR(hc.creado_en, 'YYYY-MM') = $${idx}`);
      params.push(req.query.mes);
      idx++;
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) as total FROM historial_comisiones hc ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT hc.*, c.nombre as curso_nombre, c.imagen as curso_imagen,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              o.codigo as orden_codigo
       FROM historial_comisiones hc
       LEFT JOIN cursos c ON hc.curso_id = c.id
       LEFT JOIN usuarios u ON hc.instructor_id = u.id
       LEFT JOIN ordenes o ON hc.orden_id = o.id
       ${whereClause}
       ORDER BY hc.creado_en DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json(paginatedResponse(result.rows, parseInt(countResult.rows[0].total), page, limit));
  } catch (error) { next(error); }
};

// ============================================
// PROMOCIONES (ADMIN)
// ============================================

// GET /api/commissions/promotions
const getPromotions = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.*,
              CASE WHEN p.tipo = 'curso' THEN c.nombre
                   WHEN p.tipo = 'instructor' THEN CONCAT(u.nombre, ' ', u.apellido)
                   ELSE NULL END as target_nombre
       FROM promociones_comision p
       LEFT JOIN cursos c ON p.tipo = 'curso' AND p.target_id = c.id
       LEFT JOIN usuarios u ON p.tipo = 'instructor' AND p.target_id = u.id
       ORDER BY p.creado_en DESC`
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// POST /api/commissions/promotions
const createPromotion = async (req, res, next) => {
  try {
    const { nombre, descripcion, porcentaje_bonus, tipo, target_id,
            condicion, fecha_inicio, fecha_fin } = req.body;

    const result = await query(
      `INSERT INTO promociones_comision 
        (nombre, descripcion, porcentaje_bonus, tipo, target_id, condicion, fecha_inicio, fecha_fin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nombre, descripcion, porcentaje_bonus, tipo || 'global',
       target_id || null, condicion || null, fecha_inicio, fecha_fin]
    );

    res.status(201).json({ message: 'Promoción creada.', promotion: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/commissions/promotions/:id
const togglePromotion = async (req, res, next) => {
  try {
    const { activa } = req.body;
    const result = await query(
      'UPDATE promociones_comision SET activa = $1 WHERE id = $2 RETURNING *',
      [activa, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada.' });
    }
    res.json({ message: 'Promoción actualizada.', promotion: result.rows[0] });
  } catch (error) { next(error); }
};

// ============================================
// RECÁLCULO AUTOMÁTICO DE NIVEL
// ============================================

const recalculateLevel = async (client, cursoId) => {
  // Obtener métricas actuales del curso
  const metricsResult = await client.query(
    `SELECT 
      (SELECT COUNT(*) FROM inscripciones WHERE curso_id = $1 AND estado = 'activa') as total_estudiantes,
      (SELECT COUNT(*) FROM certificados WHERE curso_id = $1 AND estado = 'activo') as total_certificados,
      (SELECT COALESCE(AVG(calificacion), 0) FROM resenas WHERE curso_id = $1) as calificacion_promedio,
      (SELECT COUNT(*) FROM resenas WHERE curso_id = $1 AND calificacion >= 4) as resenas_positivas,
      (SELECT 
        CASE WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(
          (COUNT(*) FILTER (WHERE porcentaje >= 100)::DECIMAL / COUNT(*)) * 100, 2
        ) END
       FROM progreso_usuario WHERE curso_id = $1
      ) as tasa_finalizacion`,
    [cursoId]
  );

  const m = metricsResult.rows[0];

  // Buscar el nivel más alto que cumpla los requisitos
  const levelResult = await client.query(
    `SELECT * FROM niveles_comision 
     WHERE activo = true
       AND min_estudiantes <= $1
       AND min_certificados <= $2
       AND min_calificacion <= $3
       AND min_tasa_finalizacion <= $4
       AND min_resenas <= $5
     ORDER BY orden DESC LIMIT 1`,
    [
      parseInt(m.total_estudiantes),
      parseInt(m.total_certificados),
      parseFloat(m.calificacion_promedio),
      parseFloat(m.tasa_finalizacion),
      parseInt(m.resenas_positivas)
    ]
  );

  if (levelResult.rows.length === 0) return null;

  const level = levelResult.rows[0];

  // Calcular bonus de promociones activas
  const promoResult = await client.query(
    `SELECT COALESCE(SUM(porcentaje_bonus), 0) as total_bonus
     FROM promociones_comision
     WHERE activa = true
       AND fecha_inicio <= CURRENT_DATE AND fecha_fin >= CURRENT_DATE
       AND (
         tipo = 'global' 
         OR (tipo = 'curso' AND target_id = $1)
         OR (tipo = 'instructor' AND target_id = (SELECT instructor_id FROM cursos WHERE id = $1))
       )`,
    [cursoId]
  );

  const bonus = parseFloat(promoResult.rows[0].total_bonus);
  const porcentajeTotal = parseFloat(level.porcentaje_comision) + bonus;

  // Upsert comision_cursos
  await client.query(
    `INSERT INTO comision_cursos (curso_id, nivel_id, porcentaje_actual, bonus_temporal, ultima_evaluacion)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (curso_id) DO UPDATE SET
       nivel_id = $2, porcentaje_actual = $3, bonus_temporal = $4, ultima_evaluacion = NOW()`,
    [cursoId, level.id, porcentajeTotal, bonus]
  );

  return { level, porcentajeTotal, bonus };
};

// ============================================
// FUNCIÓN PARA REGISTRAR COMISIÓN (desde pagos)
// ============================================

const registerCommission = async (client, cursoId, ordenId, montoVenta) => {
  // Obtener instructor del curso
  const courseResult = await client.query(
    'SELECT instructor_id FROM cursos WHERE id = $1',
    [cursoId]
  );

  if (courseResult.rows.length === 0) return null;

  const instructorId = courseResult.rows[0].instructor_id;

  // Recalcular nivel primero
  const levelInfo = await recalculateLevel(client, cursoId);
  if (!levelInfo) return null;

  const comision = (montoVenta * levelInfo.porcentajeTotal) / 100;

  // Registrar en historial
  await client.query(
    `INSERT INTO historial_comisiones 
      (curso_id, instructor_id, orden_id, monto_venta, porcentaje_aplicado, monto_comision, nivel_nombre)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [cursoId, instructorId, ordenId, montoVenta, levelInfo.porcentajeTotal, comision, levelInfo.level.nombre]
  );

  // Actualizar ganancias acumuladas
  await client.query(
    `UPDATE comision_cursos SET ganancias_acumuladas = ganancias_acumuladas + $1 WHERE curso_id = $2`,
    [comision, cursoId]
  );

  return { comision, porcentaje: levelInfo.porcentajeTotal, nivel: levelInfo.level.nombre };
};

// ============================================
// RESUMEN GLOBAL (ADMIN)
// ============================================

// GET /api/commissions/summary
const getCommissionSummary = async (req, res, next) => {
  try {
    const [totalPaid, byLevel, topInstructors] = await Promise.all([
      query(`SELECT COALESCE(SUM(monto_comision), 0) as total FROM historial_comisiones`),
      query(
        `SELECT nc.nombre, nc.color, nc.orden, COUNT(cc.id) as cursos
         FROM niveles_comision nc
         LEFT JOIN comision_cursos cc ON nc.id = cc.nivel_id
         WHERE nc.activo = true
         GROUP BY nc.id ORDER BY nc.orden`
      ),
      query(
        `SELECT u.id, u.nombre, u.apellido, u.avatar,
                SUM(hc.monto_comision) as ganancias_totales,
                COUNT(DISTINCT hc.curso_id) as cursos
         FROM historial_comisiones hc
         JOIN usuarios u ON hc.instructor_id = u.id
         GROUP BY u.id
         ORDER BY ganancias_totales DESC
         LIMIT 10`
      )
    ]);

    res.json({
      totalComisionesPagadas: parseFloat(totalPaid.rows[0].total),
      distribucionPorNivel: byLevel.rows,
      topInstructores: topInstructors.rows
    });
  } catch (error) { next(error); }
};

module.exports = {
  getCommissionLevels, updateCommissionLevel,
  getInstructorCommissions, getCommissionHistory,
  getPromotions, createPromotion, togglePromotion,
  getCommissionSummary,
  registerCommission, recalculateLevel
};
