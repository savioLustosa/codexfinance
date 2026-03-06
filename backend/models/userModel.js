const db = require('../config/db');

const createUser = async ({ name, email, passwordHash }) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await db.query(query, [name, email, passwordHash]);
  return rows[0];
};

const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1;', [email]);
  return rows[0];
};

const savePasswordResetToken = async (userId, resetToken, expiresAt) => {
  const query = `
    UPDATE users
    SET reset_token = $2, reset_token_expires_at = $3
    WHERE id = $1
    RETURNING id;
  `;
  await db.query(query, [userId, resetToken, expiresAt]);
};

const resetPassword = async (token, passwordHash) => {
  const query = `
    UPDATE users
    SET password_hash = $2, reset_token = NULL, reset_token_expires_at = NULL
    WHERE reset_token = $1 AND reset_token_expires_at > NOW()
    RETURNING id;
  `;
  const { rows } = await db.query(query, [token, passwordHash]);
  return rows[0];
};

module.exports = { createUser, findByEmail, savePasswordResetToken, resetPassword };
