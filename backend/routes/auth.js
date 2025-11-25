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

    console.log('Регистрация:', { username, email });

    // Валидация
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Проверка username
    const existingUsername = await User.findOne({ 
      where: { username } 
    });
    
    if (existingUsername) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    // Хэширование пароля и создание пользователя
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      username, 
      email, 
      password_hash 
    });

    // Генерация токена
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '24h' }
    );

    // Успешный ответ
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storage_limit: user.storage_limit
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Обработка ошибок уникальности
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Пользователь с таким email или именем уже существует' 
      });
    }
    
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// POST /api/auth/login — JWT-токен
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Вход:', { email });

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '24h' }
    );

    // Успешный ответ
    res.json({
      message: 'Успешный вход в систему',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storage_limit: user.storage_limit
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// GET /api/auth/profile — профиль (с токеном)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] } // Исключаем пароль из ответа
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storage_limit: user.storage_limit,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Тестовый endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

module.exports = router;