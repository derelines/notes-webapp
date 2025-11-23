const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  // 5432
  dialect: 'postgres',
  logging: false,
});
// Тестирование подключения (опционально, добавьте в конец файла)
sequelize.authenticate()
  .then(() => console.log('Подключение к БД успешно!'))
  .catch(err => console.error('Ошибка подключения к БД:', err));

module.exports = sequelize;