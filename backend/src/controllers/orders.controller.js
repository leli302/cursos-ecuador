const { query, getClient } = require('../config/database');
const { generateOrderCode } = require('../utils/helpers');
const { paginate, paginatedResponse } = require('../utils/helpers');
const { logAction } = require('../utils/logger');

// POST /api/orders
const createOrder = async (req, res, next) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Obtener carrito con items
    const cart = await client.query('SELECT id FROM carrito WHERE usuario_id = $1', [req.user.id]);
    if (cart.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Carrito vacío.' });
    }

    const items = await client.query(
      `SELECT cd.*, c.nombre, c.cupo_maximo FROM carrito_detalle cd
       JOIN cursos c ON cd.curso_id = c.id
       WHERE cd.carrito_id = $1`,
      [cart.rows[0].id]
    );

    if (items.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Carrito vacío.' });
    }

    // Calcular totales
    const subtotal = items.rows.reduce((sum, item) => sum + parseFloat(item.precio), 0);

    // Descuento premium
    const subResult = await client.query(
      `SELECT id FROM suscripciones WHERE usuario_id = $1 AND estado = 'activa' AND fecha_fin >= CURRENT_DATE`,
      [req.user.id]
    );
    const isPremium = subResult.rows.length > 0;
    const discount = isPremium ? subtotal * 0.15 : 0;
    const total = subtotal - discount;

    // Crear orden
    const orderCode = generateOrderCode();
    const order = await client.query(
      `INSERT INTO ordenes (codigo, usuario_id, subtotal, descuento, total)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [orderCode, req.user.id, subtotal.toFixed(2), discount.toFixed(2), total.toFixed(2)]
    );

    // Crear detalle de orden
    for (const item of items.rows) {
      await client.query(
        'INSERT INTO orden_detalle (orden_id, curso_id, precio) VALUES ($1,$2,$3)',
        [order.rows[0].id, item.curso_id, item.precio]
      );
    }

    // Limpiar carrito
    await client.query('DELETE FROM carrito_detalle WHERE carrito_id = $1', [cart.rows[0].id]);

    await client.query('COMMIT');

    await logAction(req.user.id, 'CREATE_ORDER', `Orden creada: ${orderCode} - Total: $${total.toFixed(2)}`, req.ip);

    res.status(201).json({
      message: 'Orden creada exitosamente.',
      order: order.rows[0],
      items: items.rows
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const isAdmin = req.user.roles.includes('administrador');
    const userId = isAdmin && req.query.userId ? req.query.userId : req.user.id;

    const whereClause = isAdmin && !req.query.userId ? '' : 'WHERE o.usuario_id = $1';
    const params = isAdmin && !req.query.userId ? [] : [userId];
    const paramIndex = params.length + 1;

    const countResult = await query(
      `SELECT COUNT(*) as total FROM ordenes o ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT o.*,
              json_agg(
                json_build_object(
                  'curso_id', od.curso_id, 'precio', od.precio,
                  'nombre', c.nombre, 'imagen', c.imagen
                )
              ) as items,
              u.nombre as usuario_nombre, u.apellido as usuario_apellido
       FROM ordenes o
       LEFT JOIN orden_detalle od ON o.id = od.orden_id
       LEFT JOIN cursos c ON od.curso_id = c.id
       LEFT JOIN usuarios u ON o.usuario_id = u.id
       ${whereClause}
       GROUP BY o.id, u.nombre, u.apellido
       ORDER BY o.creado_en DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.json(paginatedResponse(result.rows, parseInt(countResult.rows[0].total), page, limit));
  } catch (error) { next(error); }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*,
              u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.email as usuario_email
       FROM ordenes o
       LEFT JOIN usuarios u ON o.usuario_id = u.id
       WHERE o.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada.' });

    // Verificar acceso
    if (!req.user.roles.includes('administrador') && result.rows[0].usuario_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado.' });
    }

    const items = await query(
      `SELECT od.*, c.nombre, c.imagen FROM orden_detalle od
       JOIN cursos c ON od.curso_id = c.id
       WHERE od.orden_id = $1`,
      [req.params.id]
    );

    const payment = await query(
      'SELECT * FROM pagos WHERE orden_id = $1 ORDER BY creado_en DESC LIMIT 1',
      [req.params.id]
    );

    res.json({
      order: result.rows[0],
      items: items.rows,
      payment: payment.rows[0] || null
    });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getOrders, getOrderById };
