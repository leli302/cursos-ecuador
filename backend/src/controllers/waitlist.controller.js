const { query } = require('../config/database');

// POST /api/waitlist
const addToWaitlist = async (req, res, next) => {
  try {
    const { curso_id, aula_id } = req.body;
    const existing = await query(
      'SELECT id FROM lista_espera WHERE usuario_id = $1 AND curso_id = $2',
      [req.user.id, curso_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya estás en la lista de espera.' });
    }
    await query(
      'INSERT INTO lista_espera (usuario_id, curso_id, aula_id) VALUES ($1,$2,$3)',
      [req.user.id, curso_id, aula_id]
    );
    res.status(201).json({ message: 'Agregado a la lista de espera.' });
  } catch (error) { next(error); }
};

// GET /api/waitlist
const getMyWaitlist = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT le.*, c.nombre as curso_nombre, c.imagen,
              a.nombre as aula_nombre, a.fecha_inicio
       FROM lista_espera le
       JOIN cursos c ON le.curso_id = c.id
       LEFT JOIN aulas a ON le.aula_id = a.id
       WHERE le.usuario_id = $1
       ORDER BY le.fecha_registro DESC`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// DELETE /api/waitlist/:id
const removeFromWaitlist = async (req, res, next) => {
  try {
    await query('DELETE FROM lista_espera WHERE id = $1 AND usuario_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Eliminado de la lista de espera.' });
  } catch (error) { next(error); }
};

module.exports = { addToWaitlist, getMyWaitlist, removeFromWaitlist };
