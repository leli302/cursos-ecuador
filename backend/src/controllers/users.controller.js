const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { paginate, paginatedResponse } = require('../utils/helpers');
const { logAction } = require('../utils/logger');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { search, role, status } = req.query;

    let where = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      where.push(`(u.nombre ILIKE $${paramIndex} OR u.apellido ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      where.push(`r.nombre = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (status !== undefined) {
      where.push(`u.estado = $${paramIndex}`);
      params.push(status === 'true');
      paramIndex++;
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(DISTINCT u.id) as total FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.avatar,
              u.estado, u.email_verificado, u.creado_en,
              array_agg(DISTINCT r.nombre) as roles
       FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       ${whereClause}
       GROUP BY u.id
       ORDER BY u.creado_en DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.json(paginatedResponse(
      result.rows.map(u => ({ ...u, roles: u.roles.filter(Boolean) })),
      parseInt(countResult.rows[0].total),
      page,
      limit
    ));
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.avatar,
              u.estado, u.email_verificado, u.creado_en,
              array_agg(DISTINCT r.nombre) as roles
       FROM usuarios u
       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
       LEFT JOIN roles r ON ur.rol_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const user = result.rows[0];
    user.roles = user.roles.filter(Boolean);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { nombre, apellido, telefono, estado } = req.body;
    const userId = req.params.id;

    // Solo admin puede cambiar estado de otros usuarios
    if (estado !== undefined && !req.user.roles.includes('administrador') && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'No tienes permisos para cambiar el estado.' });
    }

    const result = await query(
      `UPDATE usuarios SET
        nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        telefono = COALESCE($3, telefono),
        estado = COALESCE($4, estado),
        actualizado_en = NOW()
       WHERE id = $5
       RETURNING id, nombre, apellido, email, telefono, avatar, estado`,
      [nombre, apellido, telefono, estado, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    await logAction(req.user.id, 'UPDATE_USER', `Usuario actualizado: ${userId}`, req.ip);

    res.json({ message: 'Usuario actualizado.', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Solo el mismo usuario o admin puede cambiar contraseña
    if (req.user.id !== parseInt(userId) && !req.user.roles.includes('administrador')) {
      return res.status(403).json({ error: 'No autorizado.' });
    }

    // Verificar contraseña actual (excepto admin)
    if (req.user.id === parseInt(userId)) {
      const userResult = await query('SELECT password_hash FROM usuarios WHERE id = $1', [userId]);
      const valid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta.' });
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE usuarios SET password_hash = $1, actualizado_en = NOW() WHERE id = $2', [hash, userId]);

    await logAction(req.user.id, 'CHANGE_PASSWORD', `Contraseña cambiada para usuario: ${userId}`, req.ip);

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/avatar
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Imagen requerida.' });
    }

    const avatarUrl = `/storage/avatars/${req.file.filename}`;

    await query(
      'UPDATE usuarios SET avatar = $1, actualizado_en = NOW() WHERE id = $2',
      [avatarUrl, req.params.id]
    );

    res.json({ message: 'Avatar actualizado.', avatar: avatarUrl });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/roles
const updateUserRoles = async (req, res, next) => {
  try {
    const { roles } = req.body;
    const userId = req.params.id;

    // Eliminar roles actuales
    await query('DELETE FROM usuario_roles WHERE usuario_id = $1', [userId]);

    // Asignar nuevos roles
    for (const roleName of roles) {
      const roleResult = await query('SELECT id FROM roles WHERE nombre = $1', [roleName]);
      if (roleResult.rows.length > 0) {
        await query(
          'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)',
          [userId, roleResult.rows[0].id]
        );
      }
    }

    await logAction(req.user.id, 'UPDATE_ROLES', `Roles actualizados para usuario ${userId}: ${roles.join(', ')}`, req.ip);

    res.json({ message: 'Roles actualizados.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, updateUser, changePassword, updateAvatar, updateUserRoles };
