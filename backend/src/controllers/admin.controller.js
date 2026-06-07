const { query } = require('../config/database');
const { paginate, paginatedResponse } = require('../utils/helpers');

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [users, courses, orders, revenue, recentOrders, topCourses] = await Promise.all([
      query('SELECT COUNT(*) as total FROM usuarios'),
      query("SELECT COUNT(*) as total FROM cursos WHERE estado != 'no_disponible'"),
      query("SELECT COUNT(*) as total FROM ordenes WHERE estado = 'pagado'"),
      query("SELECT COALESCE(SUM(total), 0) as total FROM ordenes WHERE estado = 'pagado'"),
      query(`SELECT o.*, u.nombre, u.apellido FROM ordenes o
             JOIN usuarios u ON o.usuario_id = u.id ORDER BY o.creado_en DESC LIMIT 5`),
      query(`SELECT c.id, c.nombre, c.total_ventas, c.valoracion, c.imagen
             FROM cursos c ORDER BY c.total_ventas DESC LIMIT 5`)
    ]);

    res.json({
      stats: {
        totalUsers: parseInt(users.rows[0].total),
        totalCourses: parseInt(courses.rows[0].total),
        totalOrders: parseInt(orders.rows[0].total),
        totalRevenue: parseFloat(revenue.rows[0].total)
      },
      recentOrders: recentOrders.rows,
      topCourses: topCourses.rows
    });
  } catch (error) { next(error); }
};

// GET /api/admin/reports
const getReports = async (req, res, next) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    let interval = '30 days';
    if (period === 'week') interval = '7 days';
    if (period === 'year') interval = '365 days';

    const [salesByDate, salesByCategory, userGrowth] = await Promise.all([
      query(`SELECT DATE(creado_en) as fecha, COUNT(*) as total, SUM(total) as revenue
             FROM ordenes WHERE estado = 'pagado' AND creado_en >= NOW() - INTERVAL '${interval}'
             GROUP BY DATE(creado_en) ORDER BY fecha`),
      query(`SELECT cat.nombre, COUNT(od.id) as ventas, SUM(od.precio) as revenue
             FROM orden_detalle od
             JOIN cursos c ON od.curso_id = c.id
             JOIN categorias cat ON c.categoria_id = cat.id
             JOIN ordenes o ON od.orden_id = o.id
             WHERE o.estado = 'pagado' AND o.creado_en >= NOW() - INTERVAL '${interval}'
             GROUP BY cat.nombre ORDER BY ventas DESC`),
      query(`SELECT DATE(creado_en) as fecha, COUNT(*) as total
             FROM usuarios WHERE creado_en >= NOW() - INTERVAL '${interval}'
             GROUP BY DATE(creado_en) ORDER BY fecha`)
    ]);

    res.json({
      salesByDate: salesByDate.rows,
      salesByCategory: salesByCategory.rows,
      userGrowth: userGrowth.rows
    });
  } catch (error) { next(error); }
};

// GET /api/admin/logs
const getLogs = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { action, userId } = req.query;

    let where = [];
    let params = [];
    let idx = 1;

    if (action) { where.push(`l.accion ILIKE $${idx}`); params.push(`%${action}%`); idx++; }
    if (userId) { where.push(`l.usuario_id = $${idx}`); params.push(userId); idx++; }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const count = await query(`SELECT COUNT(*) as total FROM logs_sistema l ${whereClause}`, params);

    const result = await query(
      `SELECT l.*, u.nombre, u.apellido, u.email
       FROM logs_sistema l
       LEFT JOIN usuarios u ON l.usuario_id = u.id
       ${whereClause}
       ORDER BY l.creado_en DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json(paginatedResponse(result.rows, parseInt(count.rows[0].total), page, limit));
  } catch (error) { next(error); }
};

module.exports = { getDashboard, getReports, getLogs };
