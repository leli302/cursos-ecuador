const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const upload = require('../config/multer');
const {
  getCategories, getAllCategories, getCategoryById,
  createCategory, updateCategory, deleteCategory
} = require('../controllers/categories.controller');

const router = Router();

router.get('/', getCategories);
router.get('/all', auth, isAdmin, getAllCategories);
router.get('/:id', getCategoryById);

router.post('/', auth, isAdmin, upload.single('category_image'), [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  validate
], createCategory);

router.put('/:id', auth, isAdmin, upload.single('category_image'), updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
