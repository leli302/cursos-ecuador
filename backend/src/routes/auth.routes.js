const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { register, login, getMe, refreshToken } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', [
  body('nombre').trim().notEmpty().withMessage('Nombre es requerido'),
  body('apellido').trim().notEmpty().withMessage('Apellido es requerido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validate
], login);

router.get('/me', auth, getMe);

router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
  validate
], refreshToken);

module.exports = router;
