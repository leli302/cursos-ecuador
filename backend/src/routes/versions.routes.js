const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');
const { getVersionsByCourse, createVersion, updateVersion } = require('../controllers/versions.controller');

const router = Router();

router.get('/course/:courseId', getVersionsByCourse);
router.post('/', auth, isAdminOrInstructor, [
  body('curso_id').isInt().withMessage('ID de curso requerido'),
  body('numero_version').trim().notEmpty().withMessage('Número de versión requerido'),
  validate
], createVersion);
router.put('/:id', auth, isAdminOrInstructor, updateVersion);

module.exports = router;
