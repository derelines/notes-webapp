// backend/server.js
const express = require('express');
const sequelize = require('./config/database'); // Ваш файл подключения
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Для кросс-доменных запросов от frontend
app.use(express.json()); // Для парсинга JSON в req.body

// Импорт роутов
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/folders', require('./routes/folders'));
app.use('/api/links', require('./routes/links'));
app.use('/api/search', require('./routes/search'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/admin', require('./routes/admin'));
//app.use(require('./middleware/logMiddleware'));

// Обработка ошибок (404 и глобальные)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' }); // 404 для несуществующих страниц
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Синхронизация БД (только для dev! В prod используйте миграции)
sequelize.sync()  // alter: true — обновляет схему без удаления данных
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });