const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const upload = require('../config/multer');
const {
  getUsers, getUserById, updateUser, changePassword, updateAvatar, updateUserRoles
} = require('../controllers/users.controller');

const router = Router();

// Admin: listar todos los usuarios
router.get('/', auth, isAdmin, getUsers);

// Ver un usuario
router.get('/:id', auth, getUserById);

// Actualizar usuario
router.put('/:id', auth, [
  body('nombre').optional().trim().notEmpty(),
  body('apellido').optional().trim().notEmpty(),
  validate
], updateUser);

// Cambiar contraseña
router.put('/:id/password', auth, [
  body('newPassword').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  validate
], changePassword);

// Actualizar avatar
router.put('/:id/avatar', auth, upload.single('avatar'), updateAvatar);

// Admin: cambiar roles
router.put('/:id/roles', auth, isAdmin, [
  body('roles').isArray().withMessage('Roles debe ser un arreglo'),
  validate
], updateUserRoles);

module.exports = router;
