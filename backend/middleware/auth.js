const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не найден' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Неверный токен' });
  }
};

module.exports = authMiddleware;