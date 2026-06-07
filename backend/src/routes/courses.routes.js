const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth, optionalAuth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');
const upload = require('../config/multer');
const {
  getCourses, getBestsellers, getRecommended, getPremiumCourses,
  getCourseById, createCourse, updateCourse, deleteCourse
} = require('../controllers/courses.controller');

const router = Router();

// Públicas
router.get('/', optionalAuth, getCourses);
router.get('/bestsellers', getBestsellers);
router.get('/recommended', optionalAuth, getRecommended);
router.get('/premium', getPremiumCourses);
router.get('/:id', optionalAuth, getCourseById);

// Protegidas (admin o instructor)
router.post('/', auth, isAdminOrInstructor, upload.single('course_image'), [
  body('codigo').trim().notEmpty().withMessage('Código requerido'),
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  validate
], createCourse);

router.put('/:id', auth, isAdminOrInstructor, upload.single('course_image'), updateCourse);
router.delete('/:id', auth, isAdminOrInstructor, deleteCourse);

module.exports = router;
