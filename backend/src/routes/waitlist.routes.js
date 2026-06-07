const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { addToWaitlist, getMyWaitlist, removeFromWaitlist } = require('../controllers/waitlist.controller');

const router = Router();
router.post('/', auth, addToWaitlist);
router.get('/', auth, getMyWaitlist);
router.delete('/:id', auth, removeFromWaitlist);

module.exports = router;
