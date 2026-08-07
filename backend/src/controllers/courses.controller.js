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
      if (status !== 'all') {
        where.push(`c.estado = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }
    } else {
      // Si el usuario es administrador o instructor, le permitimos ver todo (incluyendo inactivos)
      const userRoles = req.user?.roles || [];
      const isPrivileged = userRoles.includes('administrador') || userRoles.includes('instructor');
      if (!isPrivileged) {
        where.push(`(c.estado IS NULL OR c.estado != 'no_disponible')`);
      }
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
       WHERE c.estado IS NULL OR c.estado != 'no_disponible'
       ORDER BY c.total_ventas DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error en getBestsellers:', error);
    res.json({ data: [] });
  }
};

// GET /api/courses/recommended
const getRecommended = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    let result;
    if (req.user) {
      result = await query(
        `SELECT c.*, cat.nombre as categoria_nombre,
                u.nombre as instructor_nombre, u.apellido as instructor_apellido
         FROM cursos c
         LEFT JOIN categorias cat ON c.categoria_id = cat.id
         LEFT JOIN usuarios u ON c.instructor_id = u.id
         WHERE (c.estado IS NULL OR c.estado != 'no_disponible')
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

      if (result.rows.length === 0) {
        result = await query(
          `SELECT c.*, cat.nombre as categoria_nombre,
                  u.nombre as instructor_nombre, u.apellido as instructor_apellido
           FROM cursos c
           LEFT JOIN categorias cat ON c.categoria_id = cat.id
           LEFT JOIN usuarios u ON c.instructor_id = u.id
           WHERE c.estado IS NULL OR c.estado != 'no_disponible'
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
         WHERE c.estado IS NULL OR c.estado != 'no_disponible'
         ORDER BY c.valoracion DESC, c.total_ventas DESC
         LIMIT $1`,
        [limit]
      );
    }

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error en getRecommended:', error);
    res.json({ data: [] });
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
       WHERE c.es_premium = true AND (c.estado IS NULL OR c.estado != 'no_disponible')
       ORDER BY c.valoracion DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error en getPremiumCourses:', error);
    res.json({ data: [] });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(404).json({ error: 'ID de curso inválido.' });
    }

    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              u.avatar as instructor_avatar
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE c.id = $1`,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    const course = result.rows[0];

    // Módulos con lecciones
    let modulesList = [];
    try {
      const modules = await query(
        `SELECT m.*, 
                json_agg(
                  json_build_object(
                    'id', l.id, 'titulo', l.titulo, 'descripcion', l.descripcion, 'contenido', l.contenido,
                    'duracion_minutos', l.duracion_minutos, 'orden', l.orden, 'es_gratis', l.es_gratis
                  ) ORDER BY l.orden
                ) FILTER (WHERE l.id IS NOT NULL) as lecciones
         FROM modulos m
         LEFT JOIN lecciones l ON m.id = l.modulo_id
         WHERE m.curso_id = $1
         GROUP BY m.id
         ORDER BY m.orden`,
        [courseId]
      );
      modulesList = modules.rows;
    } catch (e) {
      console.error('Error cargando módulos:', e.message);
    }

    // Versiones
    let versionsList = [];
    try {
      const versions = await query(
        `SELECT * FROM curso_versiones WHERE curso_id = $1 ORDER BY creado_en DESC`,
        [courseId]
      );
      versionsList = versions.rows;
    } catch (e) {
      console.error('Error cargando versiones:', e.message);
    }

    // Aulas
    let classroomsList = [];
    try {
      const classrooms = await query(
        `SELECT * FROM aulas WHERE curso_id = $1 AND estado != 'cerrada' ORDER BY nombre`,
        [courseId]
      );
      classroomsList = classrooms.rows;
    } catch (e) {
      console.error('Error cargando aulas:', e.message);
    }

    // Disponibilidad
    let availabilityData = null;
    try {
      const availability = await query(
        `SELECT * FROM disponibilidad_curso WHERE curso_id = $1 ORDER BY creado_en DESC LIMIT 1`,
        [courseId]
      );
      availabilityData = availability.rows[0] || null;
    } catch (e) {
      console.error('Error cargando disponibilidad:', e.message);
    }

    // Cursos relacionados
    let relatedList = [];
    try {
      const related = await query(
        `SELECT c.id, c.nombre, c.precio, c.imagen, c.valoracion, c.total_ventas, c.nivel,
                cat.nombre as categoria_nombre
         FROM cursos c
         LEFT JOIN categorias cat ON c.categoria_id = cat.id
         WHERE c.categoria_id = $1 AND c.id != $2 AND (c.estado IS NULL OR c.estado != 'no_disponible')
         ORDER BY c.valoracion DESC
         LIMIT 4`,
        [course.categoria_id || 0, courseId]
      );
      relatedList = related.rows;
    } catch (e) {
      console.error('Error cargando cursos relacionados:', e.message);
    }

    res.json({
      course,
      modules: modulesList,
      versions: versionsList,
      classrooms: classroomsList,
      availability: availabilityData,
      related: relatedList
    });
  } catch (error) {
    console.error('Error en getCourseById:', error);
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
    const esPremiumBool = es_premium === 'true' || es_premium === true;

    const result = await query(
      `INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id,
        precio, precio_premium, imagen, nivel, duracion_horas, estado, cupo_maximo,
        fecha_disponible, version_actual, es_premium)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        codigo, 
        nombre, 
        descripcion || null, 
        categoria_id ? parseInt(categoria_id) : null, 
        req.user.id,
        precio && precio !== "" ? parseFloat(precio) : 0, 
        precio_premium && precio_premium !== "" ? parseFloat(precio_premium) : 0, 
        imagen, 
        nivel || 'todos',
        duracion_horas && duracion_horas !== "" ? parseInt(duracion_horas) : 0, 
        estado || 'disponible', 
        cupo_maximo && cupo_maximo !== "" ? parseInt(cupo_maximo) : 100,
        fecha_disponible || null, 
        version_actual || '1.0', 
        esPremiumBool
      ]
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
      [course.id, course.cupo_maximo || 100, course.fecha_disponible || new Date()]
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

    const esPremiumBool = es_premium !== undefined ? (es_premium === 'true' || es_premium === true) : undefined;

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
      [
        nombre || null, 
        descripcion || null, 
        categoria_id ? parseInt(categoria_id) : null, 
        precio !== undefined && precio !== "" ? parseFloat(precio) : null, 
        precio_premium !== undefined && precio_premium !== "" ? parseFloat(precio_premium) : null,
        imagen !== undefined ? imagen : null, 
        nivel || null, 
        duracion_horas !== undefined && duracion_horas !== "" ? parseInt(duracion_horas) : null, 
        estado || null, 
        cupo_maximo !== undefined && cupo_maximo !== "" ? parseInt(cupo_maximo) : null, 
        fecha_disponible || null, 
        esPremiumBool !== undefined ? esPremiumBool : null, 
        courseId
      ]
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

// GET /api/courses/my-courses
const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.roles.includes('administrador');
    
    // Si es administrador, ve todos los cursos. Si es instructor, solo los suyos.
    const result = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              (SELECT COUNT(*) FROM inscripciones WHERE curso_id = c.id) as total_estudiantes,
              (SELECT COALESCE(AVG(calificacion), 0) FROM resenas WHERE curso_id = c.id) as promedio_calificacion,
              (SELECT COUNT(*) FROM resenas WHERE curso_id = c.id) as total_resenas
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       WHERE ${isAdmin ? '1=1' : 'c.instructor_id = $1'}
       ORDER BY c.creado_en DESC`,
      isAdmin ? [] : [userId]
    );
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id/students
const getCourseStudents = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Verificar que el instructor es dueño del curso (o es admin)
    if (!req.user.roles.includes('administrador')) {
      const courseCheck = await query('SELECT instructor_id FROM cursos WHERE id = $1', [courseId]);
      if (courseCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Curso no encontrado.' });
      }
      if (courseCheck.rows[0].instructor_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permisos para ver los estudiantes de este curso.' });
      }
    }

    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.avatar, u.telefono,
              i.fecha_inscripcion, i.estado as inscripcion_estado,
              a.nombre as aula_nombre,
              COALESCE(
                (SELECT ROUND(AVG(CASE WHEN pu.completado THEN 100 ELSE pu.porcentaje END))
                 FROM progreso_usuario pu
                 WHERE pu.usuario_id = u.id AND pu.curso_id = $1), 0
              ) as progreso
       FROM inscripciones i
       JOIN usuarios u ON i.usuario_id = u.id
       LEFT JOIN aulas a ON i.aula_id = a.id
       WHERE i.curso_id = $1
       ORDER BY i.fecha_inscripcion DESC`,
      [courseId]
    );

    res.json({ 
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/enroll (Matriculación Gratuita)
const freeEnroll = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'ID de curso inválido.' });
    }

    // Verificar si el curso existe
    const courseRes = await query('SELECT id, nombre FROM cursos WHERE id = $1', [courseId]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ error: 'El curso no existe.' });
    }

    // Verificar si ya está inscrito
    const checkRes = await query(
      'SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2',
      [userId, courseId]
    );

    if (checkRes.rows.length > 0) {
      return res.json({ message: 'Ya estás matriculado en este curso.', enrolled: true, alreadyEnrolled: true });
    }

    // Inscripción simple — solo columnas que SIEMPRE existen
    await query(
      `INSERT INTO inscripciones (usuario_id, curso_id, estado, fecha_inscripcion)
       VALUES ($1, $2, 'activa', NOW())`,
      [userId, courseId]
    );

    // Incrementar contador de inscritos (no crítico)
    try {
      await query('UPDATE cursos SET total_ventas = COALESCE(total_ventas, 0) + 1 WHERE id = $1', [courseId]);
    } catch (e) { /* no crítico */ }

    // Log de la acción (no crítico)
    try {
      await logAction(userId, 'FREE_ENROLLMENT', `Inscripción gratuita: ${courseRes.rows[0].nombre}`, req.ip);
    } catch (e) { /* log opcional */ }

    res.status(201).json({
      message: '¡Te has matriculado exitosamente! Ya tienes acceso al curso.',
      enrolled: true
    });
  } catch (error) {
    // Si es error de unicidad (ya inscrito)
    if (error.code === '23505') {
      return res.json({ message: 'Ya estás matriculado en este curso.', enrolled: true, alreadyEnrolled: true });
    }
    console.error('Error en freeEnroll:', error.message, error.detail || '', error.code || '');
    // Devolver error detallado para diagnóstico
    res.status(500).json({ 
      error: `Error al matricularte: ${error.message || 'Error desconocido'}`,
      detail: error.detail || null,
      code: error.code || null
    });
  }
};

// GET /api/courses/:id/certifications (Tipos de Certificación al 100% de progreso)
const getCourseCertifications = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const result = await query(
      `SELECT * FROM tipos_certificacion WHERE curso_id = $1 ORDER BY precio ASC`,
      [courseId]
    );

    // Fallback si no hay registros en la tabla
    let certs = result.rows;
    if (certs.length === 0) {
      certs = [
        {
          id: 1,
          nombre: 'Certificado de Aprobación',
          descripcion: 'Certificación oficial de aprobación del curso respaldada por Cursos Ecuador.',
          beneficios: 'Código QR de verificación único, diploma en formato PDF de alta resolución, firma electrónica, badge para compartir en LinkedIn.',
          requisitos: 'Completar el 100% de las lecciones del curso.',
          precio: 29.99
        },
        {
          id: 2,
          nombre: 'Certificado Profesional Avanzado',
          descripcion: 'Certificación de alto nivel profesional con validación de competencias aplicadas y proyecto final.',
          beneficios: 'Código QR de verificación único, firma electrónica avalada, revisión de proyectos por el docente, inclusión en la Bolsa de Empleo de Cursos Ecuador.',
          requisitos: 'Completar el 100% de las lecciones y aprobar los quizzes.',
          precio: 49.99
        }
      ];
    }

    res.json({ data: certs });
  } catch (error) {
    console.error('Error en getCourseCertifications:', error);
    res.json({
      data: [
        {
          id: 1,
          nombre: 'Certificado de Aprobación Oficial',
          descripcion: 'Acredita la culminación exitosa y dominio de conceptos.',
          beneficios: 'Código QR único, firma electrónica y diploma descargable.',
          requisitos: '100% de progreso en el curso.',
          precio: 29.99
        }
      ]
    });
  }
};

module.exports = {
  getCourses, getBestsellers, getRecommended, getPremiumCourses,
  getCourseById, createCourse, updateCourse, deleteCourse, getMyCourses, getCourseStudents, freeEnroll,
  getCourseCertifications
};
