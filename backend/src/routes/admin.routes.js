const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { getDashboard, getReports, getLogs } = require('../controllers/admin.controller');
const router = Router();
router.get('/dashboard', auth, isAdmin, getDashboard);
router.get('/reports', auth, isAdmin, getReports);
router.get('/logs', auth, isAdmin, getLogs);
module.exports = router;
