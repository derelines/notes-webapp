// backend/models/Folder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Folder = sequelize.define('folders', {
id: {
type: DataTypes.BIGINT,
autoIncrement: true,
primaryKey: true,
},
parent_id: {
type: DataTypes.BIGINT,
allowNull: true,
},
owner_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
name: {
type: DataTypes.STRING(100),
allowNull: false,
},
created_at: {
type: DataTypes.DATE,
defaultValue: DataTypes.NOW,
},
is_deleted: {
type: DataTypes.BOOLEAN,
defaultValue: false,
},
}, {
tableName: 'folders',
timestamps: false,
});
module.exports = Folder;