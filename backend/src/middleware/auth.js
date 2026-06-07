const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado. Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe y está activo
    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.avatar, u.estado,
              array_agg(r.nombre) as roles
       FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    const user = result.rows[0];

    if (!user.estado) {
      return res.status(403).json({ error: 'Cuenta desactivada.' });
    }

    req.user = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles.filter(Boolean)
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    return res.status(500).json({ error: 'Error de autenticación.' });
  }
};

// Middleware opcional - no bloquea si no hay token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await query(
        `SELECT u.id, u.nombre, u.apellido, u.email, u.avatar,
                array_agg(r.nombre) as roles
         FROM usuarios u
         LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
         LEFT JOIN roles r ON ur.rol_id = r.id
         WHERE u.id = $1 AND u.estado = true
         GROUP BY u.id`,
        [decoded.userId]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        req.user = {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          avatar: user.avatar,
          roles: user.roles.filter(Boolean)
        };
      }
    }
  } catch (error) {
    // Silently continue without auth
  }
  next();
};

module.exports = { auth, optionalAuth };
