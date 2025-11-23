// backend/routes/permissions.js (Шаринг и права)
const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const authMiddleware = require('../middleware/auth');

// POST /api/permissions — создание права (шаринг)
router.post('/', authMiddleware, async (req, res) => {
  const { resource_type, resource_id, user_id, permission_level } = req.body;
  // Проверка владельца
  let resource;
  if (resource_type === 'note') resource = await Note.findByPk(resource_id);
  else if (resource_type === 'folder') resource = await Folder.findByPk(resource_id);
  if (!resource || resource.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  const permission = await Permission.create(req.body);
  res.json(permission);
});

// GET /api/permissions/:resource_type/:resource_id — получить список прав для ресурса
router.get('/:resource_type/:resource_id', authMiddleware, async (req, res) => {
  const { resource_type, resource_id } = req.params;
  // Проверка владельца ресурса
  let resource;
  if (resource_type === 'note') resource = await Note.findByPk(resource_id);
  else if (resource_type === 'folder') resource = await Folder.findByPk(resource_id);
  if (!resource || resource.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });

  const permissions = await Permission.findAll({
    where: { resource_type, resource_id },
  });
  res.json(permissions);
});

// PUT /api/permissions/:id — обновление права по ID
router.put('/:id', authMiddleware, async (req, res) => {
  const permission = await Permission.findByPk(req.params.id);
  if (!permission) return res.status(404).json({ message: 'Permission not found' });

  // Проверка владельца ресурса
  let resource;
  if (permission.resource_type === 'note') resource = await Note.findByPk(permission.resource_id);
  else if (permission.resource_type === 'folder') resource = await Folder.findByPk(permission.resource_id);
  if (!resource || resource.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });

  await permission.update(req.body);
  res.json(permission);
});

// DELETE /api/permissions/:id — удаление права по ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const permission = await Permission.findByPk(req.params.id);
  if (!permission) return res.status(404).json({ message: 'Permission not found' });

  // Проверка владельца ресурса
  let resource;
  if (permission.resource_type === 'note') resource = await Note.findByPk(permission.resource_id);
  else if (permission.resource_type === 'folder') resource = await Folder.findByPk(permission.resource_id);
  if (!resource || resource.owner_id !== req.user.id) return res.status(403).json({ message: 'Access denied' });

  await permission.destroy();
  res.json({ message: 'Permission deleted' });
});

module.exports = router;