// backend/routes/search.js (Поиск по заметкам)
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

// GET /api/search?query=term — поиск (LIKE или full-text)
router.get('/', authMiddleware, async (req, res) => {
  const { query } = req.query;
  const notes = await Note.findAll({
    where: {
      owner_id: req.user.id,
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { content: { [Op.iLike]: `%${query}%` } },
      ],
    },
  });
  res.json(notes);
});

module.exports = router;