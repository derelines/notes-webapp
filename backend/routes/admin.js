// backend/routes/admin.js (Админ-роуты)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/admin/reports — отчеты (пример: статистика)
router.get('/reports', [authMiddleware, adminMiddleware], async (req, res) => {
  const userCount = await User.count();
  res.json({ userCount });
});

// PUT /api/admin/limits/:id — обновление лимита
router.put('/limits/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update({ storage_limit: req.body.storage_limit });
  res.json(user);
});

// DELETE /api/admin/content — удаление по жалобе (пример)
router.delete('/content', [authMiddleware, adminMiddleware], async (req, res) => {
  const { complaint_id } = req.body;
  const complaint = await Complaint.findByPk(complaint_id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

  if (complaint.resource_type === 'note') {
    await Note.update({ is_deleted: true }, { where: { id: complaint.resource_id } });
  } else if (complaint.resource_type === 'folder') {
    await Folder.update({ is_deleted: true }, { where: { id: complaint.resource_id } });
  }

  complaint.status = 'resolved';
  await complaint.save();
  res.json({ message: 'Content deleted' });
});

module.exports = router;