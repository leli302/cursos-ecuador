const { query } = require('../config/database');
const { paginate, paginatedResponse } = require('../utils/helpers');
const { logAction } = require('../utils/logger');

// GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { category, level, minPrice, maxPrice, minRating, status, search, sort, premium } = req.query;

    let where = [];
    let params = [];
    let paramIndex = 1;

    // Filtros
    if (category) {
      where.push(`c.categoria_id = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    if (level) {
      where.push(`c.nivel = $${paramIndex}`);
      params.push(level);
      paramIndex++;
    }
    if (minPrice) {
      where.push(`c.precio >= $${paramIndex}`);
      params.push(parseFloat(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      where.push(`c.precio <= $${paramIndex}`);
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }
    if (minRating) {
      where.push(`c.valoracion >= $${paramIndex}`);
      params.push(parseFloat(minRating));
      paramIndex++;
    }
    if (status) {
      where.push(`c.estado = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    } else {
      where.push(`c.estado != 'no_disponible'`);
    }
    if (search) {
      where.push(`(c.nombre ILIKE $${paramIndex} OR c.descripcion ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (premium === 'true') {
      where.push(`c.es_premium = true`);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    // Ordenamiento
    let orderBy = 'c.creado_en DESC';
    switch (sort) {
      case 'price_asc': orderBy = 'c.precio ASC'; break;
      case 'price_desc': orderBy = 'c.precio DESC'; break;
      case 'rating': orderBy = 'c.valoracion DESC'; break;
      case 'sales': orderBy = 'c.total_ventas DESC'; break;
      case 'newest': orderBy = 'c.creado_en DESC'; break;
      case 'name': orderBy = 'c.nombre ASC'; break;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM cursos c ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              u.avatar as instructor_avatar,
              (SELECT COUNT(*) FROM resenas WHERE curso_id = c.id) as total_resenas
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.json(paginatedResponse(
      result.rows,
      parseInt(countResult.rows[0].total),
      page,
      limit
    ));
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/bestsellers
const getBestsellers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE c.estado = 'disponible'
       ORDER BY c.total_ventas DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/recommended
const getRecommended = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    // Si el usuario está autenticado, recomendar basado en sus compras
    let result;
    if (req.user) {
      result = await query(
        `SELECT c.*, cat.nombre as categoria_nombre,
                u.nombre as instructor_nombre, u.apellido as instructor_apellido
         FROM cursos c
         LEFT JOIN categorias cat ON c.categoria_id = cat.id
         LEFT JOIN usuarios u ON c.instructor_id = u.id
         WHERE c.estado = 'disponible'
           AND c.categoria_id IN (
             SELECT DISTINCT c2.categoria_id FROM inscripciones i
             JOIN cursos c2 ON i.curso_id = c2.id
             WHERE i.usuario_id = $1
           )
           AND c.id NOT IN (
             SELECT curso_id FROM inscripciones WHERE usuario_id = $1
           )
         ORDER BY c.valoracion DESC, c.total_ventas DESC
         LIMIT $2`,
        [req.user.id, limit]
      );

      // Si no hay recomendaciones personalizadas, devolver mejor valorados
      if (result.rows.length === 0) {
        result = await query(
          `SELECT c.*, cat.nombre as categoria_nombre,
                  u.nombre as instructor_nombre, u.apellido as instructor_apellido
           FROM cursos c
           LEFT JOIN categorias cat ON c.categoria_id = cat.id
           LEFT JOIN usuarios u ON c.instructor_id = u.id
           WHERE c.estado = 'disponible'
           ORDER BY c.valoracion DESC, c.total_ventas DESC
           LIMIT $1`,
          [limit]
        );
      }
    } else {
      result = await query(
        `SELECT c.*, cat.nombre as categoria_nombre,
                u.nombre as instructor_nombre, u.apellido as instructor_apellido
         FROM cursos c
         LEFT JOIN categorias cat ON c.categoria_id = cat.id
         LEFT JOIN usuarios u ON c.instructor_id = u.id
         WHERE c.estado = 'disponible'
         ORDER BY c.valoracion DESC, c.total_ventas DESC
         LIMIT $1`,
        [limit]
      );
    }

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/premium
const getPremiumCourses = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE c.es_premium = true AND c.estado = 'disponible'
       ORDER BY c.valoracion DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              u.avatar as instructor_avatar,
              (SELECT COUNT(*) FROM resenas WHERE curso_id = c.id) as total_resenas,
              (SELECT COALESCE(AVG(calificacion), 0) FROM resenas WHERE curso_id = c.id) as promedio_calificacion
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    const course = result.rows[0];

    // Obtener módulos con lecciones
    const modules = await query(
      `SELECT m.*, 
              json_agg(
                json_build_object(
                  'id', l.id, 'titulo', l.titulo, 'descripcion', l.descripcion,
                  'duracion_minutos', l.duracion_minutos, 'orden', l.orden, 'es_gratis', l.es_gratis
                ) ORDER BY l.orden
              ) FILTER (WHERE l.id IS NOT NULL) as lecciones
       FROM modulos m
       LEFT JOIN lecciones l ON m.id = l.modulo_id
       WHERE m.curso_id = $1
       GROUP BY m.id
       ORDER BY m.orden`,
      [req.params.id]
    );

    // Obtener versiones
    const versions = await query(
      `SELECT * FROM curso_versiones WHERE curso_id = $1 ORDER BY creado_en DESC`,
      [req.params.id]
    );

    // Obtener aulas con disponibilidad
    const classrooms = await query(
      `SELECT * FROM aulas WHERE curso_id = $1 AND estado != 'cerrada' ORDER BY nombre`,
      [req.params.id]
    );

    // Obtener disponibilidad
    const availability = await query(
      `SELECT * FROM disponibilidad_curso WHERE curso_id = $1 ORDER BY creado_en DESC LIMIT 1`,
      [req.params.id]
    );

    // Cursos relacionados (misma categoría)
    const related = await query(
      `SELECT c.id, c.nombre, c.precio, c.imagen, c.valoracion, c.total_ventas, c.nivel,
              cat.nombre as categoria_nombre
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       WHERE c.categoria_id = $1 AND c.id != $2 AND c.estado = 'disponible'
       ORDER BY c.valoracion DESC
       LIMIT 4`,
      [course.categoria_id, course.id]
    );

    res.json({
      course,
      modules: modules.rows,
      versions: versions.rows,
      classrooms: classrooms.rows,
      availability: availability.rows[0] || null,
      related: related.rows
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/courses
const createCourse = async (req, res, next) => {
  try {
    const {
      codigo, nombre, descripcion, categoria_id, precio, precio_premium,
      nivel, duracion_horas, estado, cupo_maximo, fecha_disponible,
      version_actual, es_premium
    } = req.body;

    const imagen = req.file ? `/storage/cursos/imagenes/${req.file.filename}` : null;

    const result = await query(
      `INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id,
        precio, precio_premium, imagen, nivel, duracion_horas, estado, cupo_maximo,
        fecha_disponible, version_actual, es_premium)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [codigo, nombre, descripcion, categoria_id, req.user.id,
       precio || 0, precio_premium || 0, imagen, nivel || 'todos',
       duracion_horas || 0, estado || 'disponible', cupo_maximo || 100,
       fecha_disponible, version_actual || '1.0', es_premium || false]
    );

    const course = result.rows[0];

    // Crear versión inicial
    await query(
      `INSERT INTO curso_versiones (curso_id, numero_version, descripcion, estado)
       VALUES ($1, $2, $3, 'publicado')`,
      [course.id, course.version_actual, `Versión inicial del curso ${nombre}`]
    );

    // Crear primera aula
    await query(
      `INSERT INTO aulas (curso_id, nombre, cupo_maximo, fecha_inicio, estado)
       VALUES ($1, 'Aula 1', $2, $3, 'activa')`,
      [course.id, cupo_maximo || 100, fecha_disponible || new Date()]
    );

    // Crear disponibilidad
    await query(
      `INSERT INTO disponibilidad_curso (curso_id, tipo, mensaje)
       VALUES ($1, 'disponible', 'Disponible ahora')`,
      [course.id]
    );

    await logAction(req.user.id, 'CREATE_COURSE', `Curso creado: ${nombre} (${codigo})`, req.ip);

    res.status(201).json({ message: 'Curso creado exitosamente.', course });
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id
const updateCourse = async (req, res, next) => {
  try {
    const {
      nombre, descripcion, categoria_id, precio, precio_premium,
      nivel, duracion_horas, estado, cupo_maximo, fecha_disponible,
      es_premium
    } = req.body;

    const courseId = req.params.id;
    let imagen = undefined;

    if (req.file) {
      imagen = `/storage/cursos/imagenes/${req.file.filename}`;
    }

    // Verificar permisos (admin o instructor del curso)
    if (!req.user.roles.includes('administrador')) {
      const courseCheck = await query('SELECT instructor_id FROM cursos WHERE id = $1', [courseId]);
      if (courseCheck.rows.length === 0 || courseCheck.rows[0].instructor_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permisos para editar este curso.' });
      }
    }

    const result = await query(
      `UPDATE cursos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        categoria_id = COALESCE($3, categoria_id),
        precio = COALESCE($4, precio),
        precio_premium = COALESCE($5, precio_premium),
        imagen = COALESCE($6, imagen),
        nivel = COALESCE($7, nivel),
        duracion_horas = COALESCE($8, duracion_horas),
        estado = COALESCE($9, estado),
        cupo_maximo = COALESCE($10, cupo_maximo),
        fecha_disponible = COALESCE($11, fecha_disponible),
        es_premium = COALESCE($12, es_premium),
        actualizado_en = NOW()
       WHERE id = $13
       RETURNING *`,
      [nombre, descripcion, categoria_id, precio, precio_premium,
       imagen, nivel, duracion_horas, estado, cupo_maximo,
       fecha_disponible, es_premium, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    await logAction(req.user.id, 'UPDATE_COURSE', `Curso actualizado: ${courseId}`, req.ip);

    res.json({ message: 'Curso actualizado.', course: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id (soft delete)
const deleteCourse = async (req, res, next) => {
  try {
    const result = await query(
      `UPDATE cursos SET estado = 'no_disponible', actualizado_en = NOW()
       WHERE id = $1 RETURNING id, nombre`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    await logAction(req.user.id, 'DELETE_COURSE', `Curso desactivado: ${req.params.id}`, req.ip);

    res.json({ message: 'Curso desactivado.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses, getBestsellers, getRecommended, getPremiumCourses,
  getCourseById, createCourse, updateCourse, deleteCourse
};
