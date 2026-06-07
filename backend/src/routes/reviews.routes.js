const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { getReviewsByCourse, createReview, updateReview, deleteReview } = require('../controllers/reviews.controller');
const router = Router();
router.get('/course/:courseId', getReviewsByCourse);
router.post('/', auth, [
  body('curso_id').isInt(),
  body('calificacion').isInt({ min: 1, max: 5 }),
  validate
], createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);
module.exports = router;
