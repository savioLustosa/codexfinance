const db = require('../config/db');

const createTransaction = async (userId, payload) => {
  const { type, amount, description, categoryId, transactionDate } = payload;
  const query = `
    INSERT INTO transactions (user_id, type, amount, description, category_id, transaction_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [userId, type, amount, description, categoryId, transactionDate]);
  return rows[0];
};

const updateTransaction = async (userId, id, payload) => {
  const { type, amount, description, categoryId, transactionDate } = payload;
  const query = `
    UPDATE transactions
    SET type = $3, amount = $4, description = $5, category_id = $6, transaction_date = $7, updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id, userId, type, amount, description, categoryId, transactionDate]);
  return rows[0];
};

const deleteTransaction = async (userId, id) => {
  const { rowCount } = await db.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2;', [id, userId]);
  return rowCount > 0;
};

const listTransactions = async (userId) => {
  const query = `
    SELECT t.*, c.name AS category_name
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = $1
    ORDER BY t.transaction_date DESC;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getMonthlySummary = async (userId) => {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
  `;
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

const getCategoryBreakdown = async (userId) => {
  const query = `
    SELECT c.name AS category, COALESCE(SUM(t.amount), 0) AS total
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = $1 AND t.type = 'expense'
    GROUP BY c.name
    ORDER BY total DESC;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getMonthlyChart = async (userId) => {
  const query = `
    SELECT TO_CHAR(DATE_TRUNC('month', transaction_date), 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM transactions
    WHERE user_id = $1
    GROUP BY DATE_TRUNC('month', transaction_date)
    ORDER BY DATE_TRUNC('month', transaction_date);
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listTransactions,
  getMonthlySummary,
  getCategoryBreakdown,
  getMonthlyChart,
};
