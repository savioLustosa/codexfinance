const express = require('express');
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.get('/', goalController.listGoals);
router.post('/', [body('name').isLength({ min: 2 }), body('targetAmount').isFloat({ gt: 0 }), body('deadline').isISO8601()], goalController.createGoal);
router.post('/:id/contribute', [body('amount').isFloat({ gt: 0 })], goalController.contribute);

module.exports = router;
