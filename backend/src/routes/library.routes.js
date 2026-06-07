const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getLibrary, getLibraryCourse } = require('../controllers/library.controller');
const router = Router();
router.get('/', auth, getLibrary);
router.get('/course/:courseId', auth, getLibraryCourse);
module.exports = router;
