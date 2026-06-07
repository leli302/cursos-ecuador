const { query } = require('../config/database');
const { logAction } = require('../utils/logger');

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM cursos WHERE categoria_id = c.id AND estado = 'disponible') as total_cursos
       FROM categorias c
       WHERE c.estado = true
       ORDER BY c.nombre`
    );
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/all (admin)
const getAllCategories = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM cursos WHERE categoria_id = c.id) as total_cursos
       FROM categorias c
       ORDER BY c.nombre`
    );
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
const getCategoryById = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categorias WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }
    res.json({ category: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const imagen = req.file ? `/storage/categorias/${req.file.filename}` : null;

    const result = await query(
      'INSERT INTO categorias (nombre, descripcion, imagen) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, imagen]
    );

    await logAction(req.user.id, 'CREATE_CATEGORY', `Categoría creada: ${nombre}`, req.ip);

    res.status(201).json({ message: 'Categoría creada.', category: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    const imagen = req.file ? `/storage/categorias/${req.file.filename}` : undefined;

    const result = await query(
      `UPDATE categorias SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        imagen = COALESCE($3, imagen),
        estado = COALESCE($4, estado)
       WHERE id = $5 RETURNING *`,
      [nombre, descripcion, imagen, estado, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    res.json({ message: 'Categoría actualizada.', category: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    await query('UPDATE categorias SET estado = false WHERE id = $1', [req.params.id]);
    res.json({ message: 'Categoría desactivada.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
