const { query } = require('../config/database');
const { paginate, paginatedResponse } = require('../utils/helpers');

// GET /api/reviews/course/:courseId
const getReviewsByCourse = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    const countResult = await query(
      'SELECT COUNT(*) as total FROM resenas WHERE curso_id = $1', [req.params.courseId]
    );

    const result = await query(
      `SELECT r.*, u.nombre, u.apellido, u.avatar
       FROM resenas r
       JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.curso_id = $1
       ORDER BY r.creado_en DESC
       LIMIT $2 OFFSET $3`,
      [req.params.courseId, limit, offset]
    );

    // Calcular estadísticas
    const stats = await query(
      `SELECT
        COALESCE(AVG(calificacion), 0) as promedio,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE calificacion = 5) as cinco,
        COUNT(*) FILTER (WHERE calificacion = 4) as cuatro,
        COUNT(*) FILTER (WHERE calificacion = 3) as tres,
        COUNT(*) FILTER (WHERE calificacion = 2) as dos,
        COUNT(*) FILTER (WHERE calificacion = 1) as uno
       FROM resenas WHERE curso_id = $1`,
      [req.params.courseId]
    );

    res.json({
      ...paginatedResponse(result.rows, parseInt(countResult.rows[0].total), page, limit),
      stats: stats.rows[0]
    });
  } catch (error) { next(error); }
};

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { curso_id, calificacion, comentario } = req.body;

    // Verificar inscripción
    const enrolled = await query(
      'SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2',
      [req.user.id, curso_id]
    );
    if (enrolled.rows.length === 0) {
      return res.status(403).json({ error: 'Debes estar inscrito para calificar.' });
    }

    // Verificar si ya tiene reseña
    const existing = await query(
      'SELECT id FROM resenas WHERE usuario_id = $1 AND curso_id = $2',
      [req.user.id, curso_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has calificado este curso.' });
    }

    const result = await query(
      'INSERT INTO resenas (usuario_id, curso_id, calificacion, comentario) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, curso_id, calificacion, comentario]
    );

    // Actualizar valoración promedio del curso
    const avg = await query(
      'SELECT COALESCE(AVG(calificacion), 0) as promedio FROM resenas WHERE curso_id = $1',
      [curso_id]
    );
    await query(
      'UPDATE cursos SET valoracion = $1 WHERE id = $2',
      [parseFloat(avg.rows[0].promedio).toFixed(2), curso_id]
    );

    res.status(201).json({ message: 'Reseña creada.', review: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const { calificacion, comentario } = req.body;
    const result = await query(
      `UPDATE resenas SET calificacion = COALESCE($1, calificacion), comentario = COALESCE($2, comentario)
       WHERE id = $3 AND usuario_id = $4 RETURNING *`,
      [calificacion, comentario, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Reseña no encontrada.' });

    // Actualizar valoración
    const avg = await query(
      'SELECT COALESCE(AVG(calificacion), 0) as promedio FROM resenas WHERE curso_id = $1',
      [result.rows[0].curso_id]
    );
    await query('UPDATE cursos SET valoracion = $1 WHERE id = $2',
      [parseFloat(avg.rows[0].promedio).toFixed(2), result.rows[0].curso_id]);

    res.json({ message: 'Reseña actualizada.', review: result.rows[0] });
  } catch (error) { next(error); }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await query('SELECT * FROM resenas WHERE id = $1', [req.params.id]);
    if (review.rows.length === 0) return res.status(404).json({ error: 'Reseña no encontrada.' });

    if (review.rows[0].usuario_id !== req.user.id && !req.user.roles.includes('administrador')) {
      return res.status(403).json({ error: 'No autorizado.' });
    }

    await query('DELETE FROM resenas WHERE id = $1', [req.params.id]);

    // Actualizar valoración
    const avg = await query(
      'SELECT COALESCE(AVG(calificacion), 0) as promedio FROM resenas WHERE curso_id = $1',
      [review.rows[0].curso_id]
    );
    await query('UPDATE cursos SET valoracion = $1 WHERE id = $2',
      [parseFloat(avg.rows[0].promedio).toFixed(2), review.rows[0].curso_id]);

    res.json({ message: 'Reseña eliminada.' });
  } catch (error) { next(error); }
};

module.exports = { getReviewsByCourse, createReview, updateReview, deleteReview };
