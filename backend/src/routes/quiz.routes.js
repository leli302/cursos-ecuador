const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { verifyToken, isAdminOrInstructor } = require('../middleware/auth');

// Estudiantes: Obtener quizzes de un módulo
router.get('/module/:moduleId', verifyToken, quizController.getModuleQuizzes);

// Estudiantes: Enviar respuestas de un quiz para calificar
router.post('/:evaluacionId/submit', verifyToken, quizController.submitQuiz);

// Instructores: Crear nuevo quiz
router.post('/', verifyToken, isAdminOrInstructor, quizController.createQuiz);

module.exports = router;
