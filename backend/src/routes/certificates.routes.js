const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getMyCertificates, verifyCertificate } = require('../controllers/certificates.controller');
const router = Router();
router.get('/', auth, getMyCertificates);
router.get('/verify/:code', verifyCertificate);
module.exports = router;
