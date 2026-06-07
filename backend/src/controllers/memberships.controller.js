const { query } = require('../config/database');
const { logAction } = require('../utils/logger');

// GET /api/memberships
const getMemberships = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM membresias WHERE estado = true ORDER BY precio_mensual');
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// POST /api/memberships/subscribe
const subscribe = async (req, res, next) => {
  try {
    const { membresia_id, tipo } = req.body; // tipo: 'mensual' o 'anual'

    // Verificar si ya tiene suscripción activa
    const existing = await query(
      "SELECT id FROM suscripciones WHERE usuario_id = $1 AND estado = 'activa' AND fecha_fin >= CURRENT_DATE",
      [req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya tienes una suscripción activa.' });
    }

    const fechaInicio = new Date();
    const fechaFin = new Date();
    if (tipo === 'anual') {
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
    } else {
      fechaFin.setMonth(fechaFin.getMonth() + 1);
    }

    const result = await query(
      `INSERT INTO suscripciones (usuario_id, membresia_id, tipo, fecha_inicio, fecha_fin)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, membresia_id, tipo || 'mensual', fechaInicio, fechaFin]
    );

    // Agregar rol premium
    const premiumRole = await query("SELECT id FROM roles WHERE nombre = 'premium'");
    if (premiumRole.rows.length > 0) {
      await query(
        'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [req.user.id, premiumRole.rows[0].id]
      );
    }

    await logAction(req.user.id, 'SUBSCRIBE', `Suscripción ${tipo} activada`, req.ip);

    res.status(201).json({ message: 'Suscripción activada.', subscription: result.rows[0] });
  } catch (error) { next(error); }
};

// GET /api/memberships/my-subscription
const getMySubscription = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.*, m.nombre as membresia_nombre, m.beneficios
       FROM suscripciones s
       JOIN membresias m ON s.membresia_id = m.id
       WHERE s.usuario_id = $1
       ORDER BY s.creado_en DESC LIMIT 1`,
      [req.user.id]
    );
    res.json({ subscription: result.rows[0] || null });
  } catch (error) { next(error); }
};

// DELETE /api/memberships/cancel
const cancelSubscription = async (req, res, next) => {
  try {
    await query(
      "UPDATE suscripciones SET estado = 'cancelada' WHERE usuario_id = $1 AND estado = 'activa'",
      [req.user.id]
    );
    res.json({ message: 'Suscripción cancelada.' });
  } catch (error) { next(error); }
};

module.exports = { getMemberships, subscribe, getMySubscription, cancelSubscription };
