const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/', [body('name').isLength({ min: 2, max: 50 })], categoryController.createCategory);

module.exports = router;
