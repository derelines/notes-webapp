// backend/models/NoteLink.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const NoteLink = sequelize.define('note_links', {
id: {
type: DataTypes.BIGINT,
autoIncrement: true,
primaryKey: true,
},
from_note_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
to_note_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
}, {
tableName: 'note_links',
timestamps: false,
});
module.exports = NoteLink;