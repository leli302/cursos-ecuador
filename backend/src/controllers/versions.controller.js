const { query } = require('../config/database');
const { logAction } = require('../utils/logger');

// GET /api/versions/course/:courseId
const getVersionsByCourse = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM curso_versiones WHERE curso_id = $1 ORDER BY creado_en DESC',
      [req.params.courseId]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// POST /api/versions
const createVersion = async (req, res, next) => {
  try {
    const { curso_id, numero_version, descripcion, cambios, precio, acceso_usuarios_anteriores } = req.body;

    const result = await query(
      `INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, precio, acceso_usuarios_anteriores)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [curso_id, numero_version, descripcion, cambios, precio, acceso_usuarios_anteriores ?? true]
    );

    // Registrar en historial
    const current = await query('SELECT version_actual FROM cursos WHERE id = $1', [curso_id]);
    await query(
      `INSERT INTO historial_versiones (curso_id, version_anterior, version_nueva, descripcion)
       VALUES ($1,$2,$3,$4)`,
      [curso_id, current.rows[0]?.version_actual, numero_version, cambios]
    );

    await logAction(req.user.id, 'CREATE_VERSION', `Versión ${numero_version} creada para curso ${curso_id}`, req.ip);
    res.status(201).json({ message: 'Versión creada.', version: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/versions/:id
const updateVersion = async (req, res, next) => {
  try {
    const { descripcion, cambios, estado, precio, acceso_usuarios_anteriores } = req.body;

    const result = await query(
      `UPDATE curso_versiones SET
        descripcion = COALESCE($1, descripcion),
        cambios = COALESCE($2, cambios),
        estado = COALESCE($3, estado),
        precio = COALESCE($4, precio),
        acceso_usuarios_anteriores = COALESCE($5, acceso_usuarios_anteriores)
       WHERE id = $6 RETURNING *`,
      [descripcion, cambios, estado, precio, acceso_usuarios_anteriores, req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Versión no encontrada.' });

    // Si se publica, actualizar versión actual del curso
    if (estado === 'publicado') {
      await query(
        'UPDATE cursos SET version_actual = $1, actualizado_en = NOW() WHERE id = $2',
        [result.rows[0].numero_version, result.rows[0].curso_id]
      );
    }

    res.json({ message: 'Versión actualizada.', version: result.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { getVersionsByCourse, createVersion, updateVersion };
