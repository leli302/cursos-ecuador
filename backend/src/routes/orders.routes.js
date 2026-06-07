const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { createOrder, getOrders, getOrderById } = require('../controllers/orders.controller');

const router = Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);

module.exports = router;
