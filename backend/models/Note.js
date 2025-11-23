// backend/models/Note.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Note = sequelize.define('notes', {
id: {
type: DataTypes.BIGINT,
autoIncrement: true,
primaryKey: true,
},
owner_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
content: {
type: DataTypes.TEXT,
allowNull: false,
},
title: {
type: DataTypes.STRING(200),
allowNull: false,
},
folder_id: {
type: DataTypes.BIGINT,
allowNull: true,
},
created_at: {
type: DataTypes.DATE,
defaultValue: DataTypes.NOW,
},
updated_at: {
type: DataTypes.DATE,
defaultValue: DataTypes.NOW,
},
is_deleted: {
type: DataTypes.BOOLEAN,
defaultValue: false,
},
}, {
tableName: 'notes',
timestamps: false,
});
module.exports = Note;