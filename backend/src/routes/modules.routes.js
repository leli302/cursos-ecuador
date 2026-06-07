const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');
const { getModulesByCourse, createModule, updateModule, deleteModule } = require('../controllers/modules.controller');

const router = Router();

router.get('/course/:courseId', getModulesByCourse);
router.post('/', auth, isAdminOrInstructor, [
  body('curso_id').isInt().withMessage('ID de curso requerido'),
  body('titulo').trim().notEmpty().withMessage('Título requerido'),
  validate
], createModule);
router.put('/:id', auth, isAdminOrInstructor, updateModule);
router.delete('/:id', auth, isAdminOrInstructor, deleteModule);

module.exports = router;
