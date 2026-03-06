const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const { signToken } = require('../utils/jwt');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const existing = await userModel.findByEmail(email);
  if (existing) return res.status(409).json({ message: 'E-mail já cadastrado.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ name, email, passwordHash });
  const token = signToken({ id: user.id, email: user.email });

  return res.status(201).json({ user, token });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const token = signToken({ id: user.id, email: user.email });
  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);

  if (!user) {
    return res.json({ message: 'Se o e-mail existir, um link de recuperação será enviado.' });
  }

  const resetToken = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await userModel.savePasswordResetToken(user.id, resetToken, expiresAt);

  return res.json({
    message: 'Token de recuperação gerado. Em produção, envie por e-mail.',
    resetToken,
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated = await userModel.resetPassword(token, passwordHash);

  if (!updated) {
    return res.status(400).json({ message: 'Token inválido ou expirado.' });
  }

  return res.json({ message: 'Senha redefinida com sucesso.' });
};

const logout = async (_req, res) => res.json({ message: 'Logout realizado. Remova o token do cliente.' });

module.exports = { register, login, forgotPassword, resetPassword, logout };
