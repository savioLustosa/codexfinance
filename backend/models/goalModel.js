const db = require('../config/db');

const createGoal = async (userId, name, targetAmount, deadline) => {
  const query = `
    INSERT INTO goals (user_id, name, target_amount, deadline)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [userId, name, targetAmount, deadline]);
  return rows[0];
};

const listGoalsWithProgress = async (userId) => {
  const query = `
    SELECT g.*, 
      COALESCE((SELECT SUM(amount) FROM goal_contributions gc WHERE gc.goal_id = g.id), 0) AS current_amount
    FROM goals g
    WHERE g.user_id = $1
    ORDER BY g.created_at DESC;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const addContribution = async (userId, goalId, amount) => {
  const query = `
    INSERT INTO goal_contributions (goal_id, amount)
    SELECT id, $3 FROM goals WHERE id = $2 AND user_id = $1
    RETURNING *;
  `;
  const { rows } = await db.query(query, [userId, goalId, amount]);
  return rows[0];
};

module.exports = { createGoal, listGoalsWithProgress, addContribution };
