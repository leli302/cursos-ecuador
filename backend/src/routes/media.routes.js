const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { isAdminOrInstructor } = require('../middleware/roles');
const upload = require('../config/multer');
const { uploadMedia, getMediaByLesson, deleteMedia, streamMedia } = require('../controllers/media.controller');

const router = Router();

router.get('/lesson/:lessonId', auth, getMediaByLesson);
router.post('/upload', auth, isAdminOrInstructor, upload.single('resource'), uploadMedia);
router.delete('/:id', auth, isAdminOrInstructor, deleteMedia);
router.get('/stream/:id', auth, streamMedia);

module.exports = router;
