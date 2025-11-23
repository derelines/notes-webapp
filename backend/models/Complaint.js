// backend/models/Complaint.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Complaint = sequelize.define('complaints', {
id: {
type: DataTypes.BIGINT,
autoIncrement: true,
primaryKey: true,
},
resource_type: {
type: DataTypes.STRING(10),
allowNull: false,
},
resource_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
complainant_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
reason: {
type: DataTypes.TEXT,
allowNull: false,
},
status: {
type: DataTypes.STRING(20),
defaultValue: 'pending',
},
created_at: {
type: DataTypes.DATE,
defaultValue: DataTypes.NOW,
},
}, {
tableName: 'complaints',
timestamps: false,
});
module.exports = Complaint;