// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
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
module.exports = User;