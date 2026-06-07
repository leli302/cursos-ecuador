const { query } = require('../config/database');
const { generateCertificateCode } = require('../utils/helpers');

// POST /api/progress
const updateProgress = async (req, res, next) => {
  try {
    const { curso_id, leccion_id, completado, porcentaje } = req.body;

    // Verificar inscripción
    const enrolled = await query(
      "SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2 AND estado = 'activa'",
      [req.user.id, curso_id]
    );
    if (enrolled.rows.length === 0) {
      return res.status(403).json({ error: 'No estás inscrito en este curso.' });
    }

    // Upsert progreso
    const existing = await query(
      'SELECT id FROM progreso_usuario WHERE usuario_id = $1 AND curso_id = $2 AND leccion_id = $3',
      [req.user.id, curso_id, leccion_id]
    );

    if (existing.rows.length > 0) {
      await query(
        `UPDATE progreso_usuario SET completado = $1, porcentaje = $2, ultima_vez = NOW()
         WHERE usuario_id = $3 AND curso_id = $4 AND leccion_id = $5`,
        [completado || false, porcentaje || 0, req.user.id, curso_id, leccion_id]
      );
    } else {
      await query(
        `INSERT INTO progreso_usuario (usuario_id, curso_id, leccion_id, completado, porcentaje)
         VALUES ($1,$2,$3,$4,$5)`,
        [req.user.id, curso_id, leccion_id, completado || false, porcentaje || 0]
      );
    }

    // Calcular progreso general del curso
    const totalLessons = await query(
      `SELECT COUNT(*) as total FROM lecciones l
       JOIN modulos m ON l.modulo_id = m.id
       WHERE m.curso_id = $1`,
      [curso_id]
    );

    const completedLessons = await query(
      `SELECT COUNT(*) as total FROM progreso_usuario
       WHERE usuario_id = $1 AND curso_id = $2 AND completado = true`,
      [req.user.id, curso_id]
    );

    const totalProgress = totalLessons.rows[0].total > 0
      ? Math.round((completedLessons.rows[0].total / totalLessons.rows[0].total) * 100)
      : 0;

    // Si completó 100%, generar certificado automáticamente
    let certificate = null;
    if (totalProgress >= 100) {
      const existingCert = await query(
        'SELECT * FROM certificados WHERE usuario_id = $1 AND curso_id = $2',
        [req.user.id, curso_id]
      );

      if (existingCert.rows.length === 0) {
        const version = await query(
          "SELECT id FROM curso_versiones WHERE curso_id = $1 AND estado = 'publicado' ORDER BY creado_en DESC LIMIT 1",
          [curso_id]
        );

        const certResult = await query(
          `INSERT INTO certificados (codigo_unico, usuario_id, curso_id, version_id)
           VALUES ($1,$2,$3,$4) RETURNING *`,
          [generateCertificateCode(), req.user.id, curso_id, version.rows[0]?.id]
        );
        certificate = certResult.rows[0];

        // Marcar inscripción como completada
        await query(
          "UPDATE inscripciones SET estado = 'completada' WHERE usuario_id = $1 AND curso_id = $2",
          [req.user.id, curso_id]
        );
      }
    }

    res.json({
      message: 'Progreso actualizado.',
      progress: totalProgress,
      certificate
    });
  } catch (error) { next(error); }
};

// GET /api/progress/course/:courseId
const getCourseProgress = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT pu.*, l.titulo as leccion_titulo
       FROM progreso_usuario pu
       JOIN lecciones l ON pu.leccion_id = l.id
       WHERE pu.usuario_id = $1 AND pu.curso_id = $2
       ORDER BY pu.ultima_vez DESC`,
      [req.user.id, req.params.courseId]
    );

    const totalLessons = await query(
      `SELECT COUNT(*) as total FROM lecciones l
       JOIN modulos m ON l.modulo_id = m.id WHERE m.curso_id = $1`,
      [req.params.courseId]
    );

    const completed = result.rows.filter(r => r.completado).length;
    const total = parseInt(totalLessons.rows[0].total);

    res.json({
      lessons: result.rows,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total
    });
  } catch (error) { next(error); }
};

module.exports = { updateProgress, getCourseProgress };
