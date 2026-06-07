const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { processPayment, getPaymentByOrder, updatePaymentStatus } = require('../controllers/payments.controller');

const router = Router();

router.post('/', auth, [
  body('orden_id').isInt().withMessage('ID de orden requerido'),
  validate
], processPayment);
router.get('/order/:orderId', auth, getPaymentByOrder);
router.put('/:id/status', auth, isAdmin, updatePaymentStatus);

module.exports = router;
