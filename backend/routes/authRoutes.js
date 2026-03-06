const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authRateLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  [body('name').isLength({ min: 2 }), body('email').isEmail(), body('password').isLength({ min: 6 })],
  authController.register,
);

router.post(
  '/login',
  authRateLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  authController.login,
);

router.post('/forgot-password', authRateLimiter, [body('email').isEmail()], authController.forgotPassword);
router.post('/reset-password', authRateLimiter, [body('token').notEmpty(), body('newPassword').isLength({ min: 6 })], authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;
