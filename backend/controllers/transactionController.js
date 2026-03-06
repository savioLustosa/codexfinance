const { validationResult } = require('express-validator');
const transactionModel = require('../models/transactionModel');

const listTransactions = async (req, res) => {
  const transactions = await transactionModel.listTransactions(req.user.id);
  res.json(transactions);
};

const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await transactionModel.createTransaction(req.user.id, req.body);
  res.status(201).json(transaction);
};

const updateTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updated = await transactionModel.updateTransaction(req.user.id, req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Transação não encontrada.' });
  res.json(updated);
};

const deleteTransaction = async (req, res) => {
  const deleted = await transactionModel.deleteTransaction(req.user.id, req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Transação não encontrada.' });
  return res.status(204).send();
};

const getDashboard = async (req, res) => {
  const [summary, categories, monthly] = await Promise.all([
    transactionModel.getMonthlySummary(req.user.id),
    transactionModel.getCategoryBreakdown(req.user.id),
    transactionModel.getMonthlyChart(req.user.id),
  ]);

  const balance = Number(summary.income) - Number(summary.expense);
  res.json({
    totalBalance: balance,
    monthlyIncome: Number(summary.income),
    monthlyExpense: Number(summary.expense),
    categoryChart: categories,
    monthlyChart: monthly,
  });
};

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboard,
};
