const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { updateProgress, getCourseProgress } = require('../controllers/progress.controller');
const router = Router();
router.post('/', auth, updateProgress);
router.get('/course/:courseId', auth, getCourseProgress);
module.exports = router;
