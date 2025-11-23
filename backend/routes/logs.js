// backend/routes/logs.js (Логи)
const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Middleware для автоматического логирования (добавьте в server.js: app.use(logMiddleware);)
const logMiddleware = async (req, res, next) => {
  if (req.user) {
    await Log.create({ user_id: req.user.id, action: req.method + ' ' + req.path, details: JSON.stringify(req.body) });
  }
  next();
};

// GET /api/logs — для админа
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  const logs = await Log.findAll();
  res.json(logs);
});

module.exports = router;