// backend/models/Permission.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Permission = sequelize.define('permissions', {
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
user_id: {
type: DataTypes.BIGINT,
allowNull: false,
},
permission_level: {
type: DataTypes.STRING(10),
allowNull: false,
},
share_link: {
type: DataTypes.BIGINT,
unique: true,
},
expiration: {
type: DataTypes.DATE,
allowNull: true,
},
}, {
tableName: 'permissions',
timestamps: false,
});
module.exports = Permission;