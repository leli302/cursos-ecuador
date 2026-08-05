const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin, isAdminOrInstructor } = require('../middleware/roles');
const {
  getCommissionLevels, updateCommissionLevel,
  getInstructorCommissions, getCommissionHistory,
  getPromotions, createPromotion, togglePromotion,
  getCommissionSummary
} = require('../controllers/commissions.controller');

const router = Router();

// Instructor
router.get('/instructor', auth, isAdminOrInstructor, getInstructorCommissions);
router.get('/history', auth, isAdminOrInstructor, getCommissionHistory);

// Admin
router.get('/levels', auth, isAdmin, getCommissionLevels);
router.put('/levels/:id', auth, isAdmin, updateCommissionLevel);
router.get('/promotions', auth, isAdmin, getPromotions);
router.post('/promotions', auth, isAdmin, createPromotion);
router.put('/promotions/:id', auth, isAdmin, togglePromotion);
router.get('/summary', auth, isAdmin, getCommissionSummary);

module.exports = router;
