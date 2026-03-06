const db = require('../config/db');

const listCategoriesByUser = async (userId) => {
  const { rows } = await db.query(
    'SELECT id, name, is_default FROM categories WHERE user_id = $1 OR is_default = true ORDER BY name;',
    [userId],
  );
  return rows;
};

const createCategory = async (userId, name) => {
  const { rows } = await db.query(
    'INSERT INTO categories (user_id, name, is_default) VALUES ($1, $2, false) RETURNING id, name, is_default;',
    [userId, name],
  );
  return rows[0];
};

module.exports = { listCategoriesByUser, createCategory };
