const { query, getClient } = require('../config/database');
const { logAction } = require('../utils/logger');

// POST /api/payments
const processPayment = async (req, res, next) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { orden_id, metodo } = req.body;

    // Verificar orden
    const order = await client.query(
      "SELECT * FROM ordenes WHERE id = $1 AND usuario_id = $2 AND estado = 'pendiente'",
      [orden_id, req.user.id]
    );

    if (order.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Orden no encontrada o ya procesada.' });
    }

    // Simular pago (siempre exitoso en modo simulación)
    const referencia = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const payment = await client.query(
      `INSERT INTO pagos (orden_id, usuario_id, monto, metodo, estado, referencia)
       VALUES ($1,$2,$3,$4,'completado',$5) RETURNING *`,
      [orden_id, req.user.id, order.rows[0].total, metodo || 'tarjeta_simulada', referencia]
    );

    // Actualizar estado de la orden
    await client.query("UPDATE ordenes SET estado = 'pagado' WHERE id = $1", [orden_id]);

    // Dar acceso a los cursos comprados
    const items = await client.query(
      'SELECT curso_id FROM orden_detalle WHERE orden_id = $1',
      [orden_id]
    );

    for (const item of items.rows) {
      // Buscar aula disponible
      const aula = await client.query(
        `SELECT id, cupo_ocupado, cupo_maximo FROM aulas
         WHERE curso_id = $1 AND estado = 'activa' AND cupo_ocupado < cupo_maximo
         ORDER BY nombre LIMIT 1`,
        [item.curso_id]
      );

      let aulaId = null;
      if (aula.rows.length > 0) {
        aulaId = aula.rows[0].id;
        // Incrementar cupo
        await client.query(
          'UPDATE aulas SET cupo_ocupado = cupo_ocupado + 1 WHERE id = $1',
          [aulaId]
        );

        // Si se llenó, crear nueva aula
        if (aula.rows[0].cupo_ocupado + 1 >= aula.rows[0].cupo_maximo) {
          await client.query(
            "UPDATE aulas SET estado = 'llena' WHERE id = $1",
            [aulaId]
          );

          // Obtener total_ventas del curso para decidir fecha de inicio dinámica
          const cursoRes = await client.query(
            'SELECT total_ventas FROM cursos WHERE id = $1',
            [item.curso_id]
          );
          const totalVentas = cursoRes.rows[0]?.total_ventas || 0;
          const diasEspera = totalVentas >= 100 ? 5 : 21;

          // Crear siguiente aula
          const aulaCount = await client.query(
            'SELECT COUNT(*) as count FROM aulas WHERE curso_id = $1',
            [item.curso_id]
          );
          const nextNum = parseInt(aulaCount.rows[0].count) + 1;
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + diasEspera);

          await client.query(
            `INSERT INTO aulas (curso_id, nombre, cupo_maximo, fecha_inicio, estado)
             VALUES ($1, $2, 100, $3, 'activa')`,
            [item.curso_id, `Aula ${nextNum}`, nextDate]
          );
        }
      }

      // Obtener versión actual
      const version = await client.query(
        "SELECT id FROM curso_versiones WHERE curso_id = $1 AND estado = 'publicado' ORDER BY creado_en DESC LIMIT 1",
        [item.curso_id]
      );

      // Crear inscripción
      await client.query(
        `INSERT INTO inscripciones (usuario_id, curso_id, aula_id, version_id, estado)
         VALUES ($1,$2,$3,$4,'activa')
         ON CONFLICT DO NOTHING`,
        [req.user.id, item.curso_id, aulaId, version.rows[0]?.id]
      );

      // Incrementar ventas del curso
      await client.query(
        'UPDATE cursos SET total_ventas = total_ventas + 1 WHERE id = $1',
        [item.curso_id]
      );
    }

    await client.query('COMMIT');

    await logAction(req.user.id, 'PAYMENT', `Pago completado: ${referencia} - $${order.rows[0].total}`, req.ip);

    res.json({
      message: 'Pago procesado exitosamente.',
      payment: payment.rows[0],
      order: { ...order.rows[0], estado: 'pagado' }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// GET /api/payments/order/:orderId
const getPaymentByOrder = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM pagos WHERE orden_id = $1 ORDER BY creado_en DESC LIMIT 1',
      [req.params.orderId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pago no encontrado.' });
    res.json({ payment: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/payments/:id/status (admin)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const result = await query(
      'UPDATE pagos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pago no encontrado.' });

    // Si se reembolsa, actualizar orden
    if (estado === 'reembolsado') {
      await query("UPDATE ordenes SET estado = 'reembolsado' WHERE id = $1", [result.rows[0].orden_id]);
    }

    res.json({ message: 'Estado de pago actualizado.', payment: result.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { processPayment, getPaymentByOrder, updatePaymentStatus };
