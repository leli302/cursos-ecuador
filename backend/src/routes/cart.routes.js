const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cart.controller');

const router = Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.delete('/remove/:courseId', auth, removeFromCart);
router.delete('/clear', auth, clearCart);

module.exports = router;
