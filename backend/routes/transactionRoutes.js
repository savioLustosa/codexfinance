const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

const baseValidation = [
  body('type').isIn(['income', 'expense']),
  body('amount').isFloat({ gt: 0 }),
  body('description').isLength({ min: 2, max: 120 }),
  body('categoryId').isInt({ gt: 0 }),
  body('transactionDate').isISO8601(),
];

router.get('/', transactionController.listTransactions);
router.post('/', baseValidation, transactionController.createTransaction);
router.put('/:id', baseValidation, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/dashboard/summary', transactionController.getDashboard);

module.exports = router;
