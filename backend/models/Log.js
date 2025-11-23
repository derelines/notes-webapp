// backend/models/Log.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Log = sequelize.define('logs', {
id: {
type: DataTypes.BIGINT,
autoIncrement: true,
primaryKey: true,
},
user_id: {
type: DataTypes.BIGINT,
allowNull: true,
},
action: {
type: DataTypes.STRING(100),
allowNull: false,
},
timestamp: {
type: DataTypes.DATE,
defaultValue: DataTypes.NOW,
},
details: {
type: DataTypes.TEXT,
allowNull: true,
},
}, {
tableName: 'logs',
timestamps: false,
});
module.exports = Log;