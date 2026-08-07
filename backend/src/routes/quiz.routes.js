const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { auth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');

// Estudiantes: Obtener quizzes de un módulo
router.get('/module/:moduleId', auth, quizController.getModuleQuizzes);

// Estudiantes: Enviar respuestas de un quiz para calificar
router.post('/:evaluacionId/submit', auth, quizController.submitQuiz);

// Instructores: Crear nuevo quiz
router.post('/', auth, isAdminOrInstructor, quizController.createQuiz);

module.exports = router;
