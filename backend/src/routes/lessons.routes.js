const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');
const { getLessonsByModule, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons.controller');

const router = Router();

router.get('/module/:moduleId', getLessonsByModule);
router.post('/', auth, isAdminOrInstructor, [
  body('modulo_id').isInt().withMessage('ID de módulo requerido'),
  body('titulo').trim().notEmpty().withMessage('Título requerido'),
  validate
], createLesson);
router.put('/:id', auth, isAdminOrInstructor, updateLesson);
router.delete('/:id', auth, isAdminOrInstructor, deleteLesson);

module.exports = router;
