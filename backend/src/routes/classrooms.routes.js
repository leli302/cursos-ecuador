const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { getClassroomsByCourse, createClassroom, updateClassroom } = require('../controllers/classrooms.controller');

const router = Router();
router.get('/course/:courseId', getClassroomsByCourse);
router.post('/', auth, isAdmin, createClassroom);
router.put('/:id', auth, isAdmin, updateClassroom);

module.exports = router;
