// backend/routes/notes.js (Заметки: CRUD)
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const limitMiddleware = require('../middleware/limit');

// GET /api/notes — список заметок пользователя
router.get('/', authMiddleware, async (req, res) => {
  const notes = await Note.findAll({ where: { owner_id: req.user.id, is_deleted: false } });
  res.json(notes);
});

// POST /api/notes — создание заметки
router.post('/', [authMiddleware, limitMiddleware], async (req, res) => {
  const note = await Note.create({ ...req.body, owner_id: req.user.id });
  res.json(note);
});

// PUT /api/notes/:id — редактирование
router.put('/:id', authMiddleware, async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note || note.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  await note.update(req.body);
  res.json(note);
});

// DELETE /api/notes/:id — удаление (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note || note.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  note.is_deleted = true;
  await note.save();
  res.json({ message: 'Deleted' });
});

module.exports = router;