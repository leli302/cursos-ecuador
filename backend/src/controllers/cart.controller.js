const { query } = require('../config/database');

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await query('SELECT * FROM carrito WHERE usuario_id = $1', [req.user.id]);

    if (cart.rows.length === 0) {
      const newCart = await query(
        'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *',
        [req.user.id]
      );
      cart = newCart;
    }

    const items = await query(
      `SELECT cd.*, c.nombre, c.imagen, c.precio as precio_actual,
              c.precio_premium, c.estado, c.instructor_id,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido
       FROM carrito_detalle cd
       JOIN cursos c ON cd.curso_id = c.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE cd.carrito_id = $1`,
      [cart.rows[0].id]
    );

    // Calcular totales
    const subtotal = items.rows.reduce((sum, item) => sum + parseFloat(item.precio), 0);

    // Verificar si es premium para descuento
    const subResult = await query(
      `SELECT id FROM suscripciones WHERE usuario_id = $1 AND estado = 'activa' AND fecha_fin >= CURRENT_DATE`,
      [req.user.id]
    );
    const isPremium = subResult.rows.length > 0;
    const discount = isPremium ? subtotal * 0.15 : 0; // 15% descuento premium

    res.json({
      cart: {
        id: cart.rows[0].id,
        items: items.rows,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: (subtotal - discount).toFixed(2),
        isPremium,
        itemCount: items.rows.length
      }
    });
  } catch (error) { next(error); }
};

// POST /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    const { curso_id } = req.body;

    // Verificar que el curso existe y está disponible o próximo (preventa)
    const course = await query(
      "SELECT id, precio, precio_premium, estado FROM cursos WHERE id = $1 AND estado IN ('disponible', 'proximo')",
      [curso_id]
    );
    if (course.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no disponible.' });
    }

    // Verificar si ya está inscrito
    const enrolled = await query(
      "SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2 AND estado = 'activa'",
      [req.user.id, curso_id]
    );
    if (enrolled.rows.length > 0) {
      return res.status(400).json({ error: 'Ya estás inscrito en este curso.' });
    }

    // Obtener o crear carrito
    let cart = await query('SELECT id FROM carrito WHERE usuario_id = $1', [req.user.id]);
    if (cart.rows.length === 0) {
      cart = await query('INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING id', [req.user.id]);
    }

    // Verificar si ya está en el carrito
    const existing = await query(
      'SELECT id FROM carrito_detalle WHERE carrito_id = $1 AND curso_id = $2',
      [cart.rows[0].id, curso_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Este curso ya está en tu carrito.' });
    }

    // Verificar premium para precio
    const subResult = await query(
      `SELECT id FROM suscripciones WHERE usuario_id = $1 AND estado = 'activa' AND fecha_fin >= CURRENT_DATE`,
      [req.user.id]
    );
    const isPremium = subResult.rows.length > 0;
    const precio = isPremium && course.rows[0].precio_premium > 0
      ? course.rows[0].precio_premium
      : course.rows[0].precio;

    await query(
      'INSERT INTO carrito_detalle (carrito_id, curso_id, precio) VALUES ($1, $2, $3)',
      [cart.rows[0].id, curso_id, precio]
    );

    await query('UPDATE carrito SET actualizado_en = NOW() WHERE id = $1', [cart.rows[0].id]);

    res.status(201).json({ message: 'Curso agregado al carrito.' });
  } catch (error) { next(error); }
};

// DELETE /api/cart/remove/:courseId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await query('SELECT id FROM carrito WHERE usuario_id = $1', [req.user.id]);
    if (cart.rows.length === 0) return res.status(404).json({ error: 'Carrito no encontrado.' });

    await query(
      'DELETE FROM carrito_detalle WHERE carrito_id = $1 AND curso_id = $2',
      [cart.rows[0].id, req.params.courseId]
    );

    res.json({ message: 'Curso eliminado del carrito.' });
  } catch (error) { next(error); }
};

// DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    const cart = await query('SELECT id FROM carrito WHERE usuario_id = $1', [req.user.id]);
    if (cart.rows.length > 0) {
      await query('DELETE FROM carrito_detalle WHERE carrito_id = $1', [cart.rows[0].id]);
    }
    res.json({ message: 'Carrito vaciado.' });
  } catch (error) { next(error); }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
