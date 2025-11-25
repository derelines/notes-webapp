const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'user',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  storage_limit: {
    type: DataTypes.DECIMAL,
    defaultValue: 1000,  // в MB
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Виртуальное поле для пароля (не сохраняется в БД)
User.prototype.password = null;

// Хук для хэширования пароля перед созданием
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 10);
  }
});

// Хук для хэширования пароля перед обновлением
User.beforeUpdate(async (user) => {
  if (user.changed('password') && user.password) {
    user.password_hash = await bcrypt.hash(user.password, 10);
  }
});

// Метод для проверки пароля
User.prototype.checkPassword = function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;