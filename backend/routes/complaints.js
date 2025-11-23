// backend/routes/complaints.js (Жалобы)
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// POST /api/complaints — подача жалобы
router.post('/', authMiddleware, async (req, res) => {
  const complaint = await Complaint.create({ ...req.body, complainant_id: req.user.id });
  res.json(complaint);
});

// GET /api/complaints — для админа (список)
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  const complaints = await Complaint.findAll({ where: { status: 'pending' } }); // Фильтр по статусу
  res.json(complaints);
});

module.exports = router;