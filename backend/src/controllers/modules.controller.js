const { query } = require('../config/database');

// GET /api/modules/course/:courseId
const getModulesByCourse = async (req, res, next) => {
  try {
    const result = await query(
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
      [req.params.courseId]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// POST /api/modules
const createModule = async (req, res, next) => {
  try {
    const { curso_id, version_id, titulo, descripcion, orden } = req.body;
    const result = await query(
      `INSERT INTO modulos (curso_id, version_id, titulo, descripcion, orden)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [curso_id, version_id, titulo, descripcion, orden || 1]
    );
    res.status(201).json({ message: 'Módulo creado.', module: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/modules/:id
const updateModule = async (req, res, next) => {
  try {
    const { titulo, descripcion, orden } = req.body;
    const result = await query(
      `UPDATE modulos SET titulo = COALESCE($1, titulo), descripcion = COALESCE($2, descripcion),
       orden = COALESCE($3, orden) WHERE id = $4 RETURNING *`,
      [titulo, descripcion, orden, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Módulo no encontrado.' });
    res.json({ message: 'Módulo actualizado.', module: result.rows[0] });
  } catch (error) { next(error); }
};

// DELETE /api/modules/:id
const deleteModule = async (req, res, next) => {
  try {
    await query('DELETE FROM modulos WHERE id = $1', [req.params.id]);
    res.json({ message: 'Módulo eliminado.' });
  } catch (error) { next(error); }
};

module.exports = { getModulesByCourse, createModule, updateModule, deleteModule };
