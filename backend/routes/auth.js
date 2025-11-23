// backend/routes/auth.js (Аутентификация: register, login, profile)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register — создание пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ where: { email } })) return res.status(400).json({ message: 'User exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password_hash });
    res.json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login — JWT-токен
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/profile — профиль (с токеном)
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
});

module.exports = router;