const { query } = require('../config/database');

// GET /api/lessons/module/:moduleId
const getLessonsByModule = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT l.*,
              json_agg(
                json_build_object(
                  'id', rm.id, 'tipo', rm.tipo, 'titulo', rm.titulo,
                  'url_archivo', rm.url_archivo, 'tamano_mb', rm.tamano_mb,
                  'duracion_segundos', rm.duracion_segundos, 'orden', rm.orden
                ) ORDER BY rm.orden
              ) FILTER (WHERE rm.id IS NOT NULL) as recursos
       FROM lecciones l
       LEFT JOIN recursos_multimedia rm ON l.id = rm.leccion_id
       WHERE l.modulo_id = $1
       GROUP BY l.id
       ORDER BY l.orden`,
      [req.params.moduleId]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// POST /api/lessons
const createLesson = async (req, res, next) => {
  try {
    const { modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis } = req.body;
    const result = await query(
      `INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [modulo_id, titulo, descripcion, duracion_minutos || 0, orden || 1, es_gratis || false]
    );
    res.status(201).json({ message: 'Lección creada.', lesson: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/lessons/:id
const updateLesson = async (req, res, next) => {
  try {
    const { titulo, descripcion, duracion_minutos, orden, es_gratis } = req.body;
    const result = await query(
      `UPDATE lecciones SET titulo = COALESCE($1, titulo), descripcion = COALESCE($2, descripcion),
       duracion_minutos = COALESCE($3, duracion_minutos), orden = COALESCE($4, orden),
       es_gratis = COALESCE($5, es_gratis) WHERE id = $6 RETURNING *`,
      [titulo, descripcion, duracion_minutos, orden, es_gratis, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lección no encontrada.' });
    res.json({ message: 'Lección actualizada.', lesson: result.rows[0] });
  } catch (error) { next(error); }
};

// DELETE /api/lessons/:id
const deleteLesson = async (req, res, next) => {
  try {
    await query('DELETE FROM lecciones WHERE id = $1', [req.params.id]);
    res.json({ message: 'Lección eliminada.' });
  } catch (error) { next(error); }
};

module.exports = { getLessonsByModule, createLesson, updateLesson, deleteLesson };
