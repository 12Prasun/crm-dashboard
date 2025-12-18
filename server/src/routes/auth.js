import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser, getUserById } from '../services/authService.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().trim().escape(),
    body('lastName').notEmpty().trim().escape(),
    body('tenantName').notEmpty().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, tenantName } = req.body;

      const { user, token } = await registerUser(tenantName, email, password, firstName, lastName);

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const { user, token } = await loginUser(email, password);

      res.json({ user, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }
);

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId, req.user.tenantId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
