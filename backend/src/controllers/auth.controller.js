const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { logAction } = require('../utils/logger');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Verificar si el email ya existe
    const existing = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Este email ya está registrado.' });
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = await query(
      `INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, email`,
      [nombre, apellido, email, passwordHash, telefono || null]
    );

    const user = result.rows[0];

    // Asignar rol de estudiante por defecto
    const roleResult = await query('SELECT id FROM roles WHERE nombre = $1', ['estudiante']);
    if (roleResult.rows.length > 0) {
      await query(
        'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)',
        [user.id, roleResult.rows[0].id]
      );
    }

    // Crear carrito vacío
    await query('INSERT INTO carrito (usuario_id) VALUES ($1)', [user.id]);

    const tokens = generateTokens(user.id);

    await logAction(user.id, 'REGISTRO', `Nuevo usuario registrado: ${email}`, req.ip);

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        roles: ['estudiante']
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con roles
    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.password_hash, u.avatar, u.estado,
              array_agg(r.nombre) as roles
       FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const user = result.rows[0];

    if (!user.estado) {
      return res.status(403).json({ error: 'Tu cuenta está desactivada.' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const tokens = generateTokens(user.id);

    // Verificar suscripción premium activa
    const subResult = await query(
      `SELECT s.id FROM suscripciones s
       WHERE s.usuario_id = $1 AND s.estado = 'activa' AND s.fecha_fin >= CURRENT_DATE
       LIMIT 1`,
      [user.id]
    );
    const isPremium = subResult.rows.length > 0;

    await logAction(user.id, 'LOGIN', `Inicio de sesión: ${email}`, req.ip);

    res.json({
      message: 'Inicio de sesión exitoso.',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles.filter(Boolean),
        isPremium
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.avatar, u.estado,
              u.email_verificado, u.creado_en,
              array_agg(DISTINCT r.nombre) as roles
       FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const user = result.rows[0];

    // Verificar suscripción premium
    const subResult = await query(
      `SELECT s.id, s.tipo, s.fecha_inicio, s.fecha_fin, m.nombre as membresia
       FROM suscripciones s
       JOIN membresias m ON s.membresia_id = m.id
       WHERE s.usuario_id = $1 AND s.estado = 'activa' AND s.fecha_fin >= CURRENT_DATE
       LIMIT 1`,
      [req.user.id]
    );

    res.json({
      user: {
        ...user,
        roles: user.roles.filter(Boolean),
        password_hash: undefined,
        suscripcion: subResult.rows[0] || null,
        isPremium: subResult.rows.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token requerido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const tokens = generateTokens(decoded.userId);

    res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido o expirado.' });
  }
};

module.exports = { register, login, getMe, refreshToken };
