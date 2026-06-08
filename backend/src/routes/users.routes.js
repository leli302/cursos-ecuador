const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const upload = require('../config/multer');
const {
  getUsers, getUserById, updateUser, changePassword, updateAvatar, updateUserRoles, createUser
} = require('../controllers/users.controller');

const router = Router();

// Admin: crear usuario
router.post('/', auth, isAdmin, [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellido').trim().notEmpty().withMessage('El apellido es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  validate
], createUser);

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
