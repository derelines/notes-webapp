// backend/middleware/limit.js (проверка лимита хранения, пример для заметок)
const { Note } = require('../models');

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const currentSize = await Note.sum('LENGTH(content)', { where: { owner_id: userId } }) || 0; // Пример подсчёта размера в байтах
  const newSize = req.body.content ? Buffer.byteLength(req.body.content, 'utf8') : 0;

  if (currentSize + newSize > user.storage_limit * 1024 * 1024) { // Лимит в байтах (MB * 1024 * 1024)
    return res.status(403).json({ message: 'Storage limit exceeded' });
  }
  next();
};