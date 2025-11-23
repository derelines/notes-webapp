// backend/routes/folders.js (Папки: CRUD с вложенностью)
const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const authMiddleware = require('../middleware/auth');

// GET /api/folders — дерево папок (рекурсивный запрос, пример простой)
router.get('/', authMiddleware, async (req, res) => {
  const folders = await Folder.findAll({ where: { owner_id: req.user.id, is_deleted: false } });
  res.json(folders); // Для дерева используйте рекурсию в frontend или nested query
});

// POST /api/folders — создание
router.post('/', authMiddleware, async (req, res) => {
  const folder = await Folder.create({ ...req.body, owner_id: req.user.id });
  res.json(folder);
});

// PUT /api/folders/:id — редактирование
router.put('/:id', authMiddleware, async (req, res) => {
  const folder = await Folder.findByPk(req.params.id);
  if (!folder || folder.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  await folder.update(req.body);
  res.json(folder);
});

// DELETE /api/folders/:id — soft delete
router.delete('/:id', authMiddleware, async (req, res) => {
  const folder = await Folder.findByPk(req.params.id);
  if (!folder || folder.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  folder.is_deleted = true;
  await folder.save();
  res.json({ message: 'Deleted' });
});

module.exports = router;