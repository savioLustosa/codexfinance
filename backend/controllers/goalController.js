const { validationResult } = require('express-validator');
const goalModel = require('../models/goalModel');

const createGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const goal = await goalModel.createGoal(
    req.user.id,
    req.body.name,
    req.body.targetAmount,
    req.body.deadline,
  );

  return res.status(201).json(goal);
};

const listGoals = async (req, res) => {
  const goals = await goalModel.listGoalsWithProgress(req.user.id);
  const withProgress = goals.map((goal) => ({
    ...goal,
    progress: goal.target_amount > 0 ? Number(goal.current_amount) / Number(goal.target_amount) : 0,
  }));
  return res.json(withProgress);
};

const contribute = async (req, res) => {
  const contribution = await goalModel.addContribution(req.user.id, req.params.id, req.body.amount);
  if (!contribution) return res.status(404).json({ message: 'Meta não encontrada.' });
  return res.status(201).json(contribution);
};

module.exports = { createGoal, listGoals, contribute };
