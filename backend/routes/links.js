// backend/routes/links.js (Связи между заметками)
const express = require('express');
const router = express.Router();
const NoteLink = require('../models/NoteLink');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

// POST /api/links — создание связи
router.post('/', authMiddleware, async (req, res) => {
  const { from_note_id, to_note_id } = req.body;
  const fromNote = await Note.findByPk(from_note_id);
  if (!fromNote || fromNote.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  const link = await NoteLink.create({ from_note_id, to_note_id });
  res.json(link);
});

// GET /api/links/:noteId — получить все связи для заметки (outgoing и incoming)
router.get('/:noteId', authMiddleware, async (req, res) => {
  const noteId = req.params.noteId;
  const note = await Note.findByPk(noteId);
  if (!note || note.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });

  const outgoing = await NoteLink.findAll({ where: { from_note_id: noteId } });
  const incoming = await NoteLink.findAll({ where: { to_note_id: noteId } });

  res.json({ outgoing, incoming });
});

// DELETE /api/links/:id — удаление связи по ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const link = await NoteLink.findByPk(req.params.id);
  if (!link) return res.status(404).json({ message: 'Link not found' });

  // Проверка владения: проверяем, что пользователь владеет from_note
  const fromNote = await Note.findByPk(link.from_note_id);
  if (!fromNote || fromNote.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });

  await link.destroy();
  res.json({ message: 'Link deleted' });
});

module.exports = router;