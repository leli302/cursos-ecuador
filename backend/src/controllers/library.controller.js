const { query } = require('../config/database');

// GET /api/library
const getLibrary = async (req, res, next) => {
  try {
    const courses = await query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              i.fecha_inscripcion, i.estado as inscripcion_estado,
              cv.numero_version,
              (SELECT fecha_estimada FROM disponibilidad_curso WHERE curso_id = c.id ORDER BY creado_en DESC LIMIT 1) as fecha_disponible,
              COALESCE(
                (SELECT ROUND(AVG(CASE WHEN pu.completado THEN 100 ELSE pu.porcentaje END))
                 FROM progreso_usuario pu
                 WHERE pu.usuario_id = $1 AND pu.curso_id = c.id), 0
              ) as progreso
       FROM inscripciones i
       JOIN cursos c ON i.curso_id = c.id
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       LEFT JOIN curso_versiones cv ON i.version_id = cv.id
       WHERE i.usuario_id = $1 AND i.estado = 'activa'
       ORDER BY i.fecha_inscripcion DESC`,
      [req.user.id]
    );

    // Obtener certificados
    const certificates = await query(
      `SELECT cert.*, c.nombre as curso_nombre
       FROM certificados cert
       JOIN cursos c ON cert.curso_id = c.id
       WHERE cert.usuario_id = $1
       ORDER BY cert.fecha_emision DESC`,
      [req.user.id]
    );

    res.json({
      courses: courses.rows,
      certificates: certificates.rows,
      totalCourses: courses.rows.length,
      completedCourses: courses.rows.filter(c => c.progreso >= 100).length
    });
  } catch (error) { next(error); }
};

// GET /api/library/course/:courseId
const getLibraryCourse = async (req, res, next) => {
  try {
    // Verificar inscripción
    const enrolled = await query(
      "SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2 AND estado = 'activa'",
      [req.user.id, req.params.courseId]
    );
    if (enrolled.rows.length === 0) {
      return res.status(403).json({ error: 'No estás inscrito en este curso.' });
    }

    // Obtener curso con módulos, lecciones y recursos
    const course = await query(
      `SELECT c.*, u.nombre as instructor_nombre, u.apellido as instructor_apellido
       FROM cursos c LEFT JOIN usuarios u ON c.instructor_id = u.id WHERE c.id = $1`,
      [req.params.courseId]
    );

    const modules = await query(
      `SELECT m.*,
              json_agg(
                json_build_object(
                  'id', l.id, 'titulo', l.titulo, 'descripcion', l.descripcion,
                  'duracion_minutos', l.duracion_minutos, 'orden', l.orden,
                  'completado', COALESCE(pu.completado, false),
                  'porcentaje', COALESCE(pu.porcentaje, 0),
                  'recursos', (
                    SELECT json_agg(json_build_object(
                      'id', rm.id, 'tipo', rm.tipo, 'titulo', rm.titulo,
                      'url_archivo', rm.url_archivo, 'tamano_mb', rm.tamano_mb,
                      'duracion_segundos', rm.duracion_segundos
                    ) ORDER BY rm.orden)
                    FROM recursos_multimedia rm WHERE rm.leccion_id = l.id
                  )
                ) ORDER BY l.orden
              ) FILTER (WHERE l.id IS NOT NULL) as lecciones
       FROM modulos m
       LEFT JOIN lecciones l ON m.id = l.modulo_id
       LEFT JOIN progreso_usuario pu ON pu.leccion_id = l.id AND pu.usuario_id = $2
       WHERE m.curso_id = $1
       GROUP BY m.id
       ORDER BY m.orden`,
      [req.params.courseId, req.user.id]
    );

    res.json({
      course: course.rows[0],
      modules: modules.rows
    });
  } catch (error) { next(error); }
};

module.exports = { getLibrary, getLibraryCourse };
