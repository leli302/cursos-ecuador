const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getMemberships, subscribe, getMySubscription, cancelSubscription } = require('../controllers/memberships.controller');
const router = Router();
router.get('/', getMemberships);
router.post('/subscribe', auth, subscribe);
router.get('/my-subscription', auth, getMySubscription);
router.delete('/cancel', auth, cancelSubscription);
module.exports = router;
