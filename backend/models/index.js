// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Folder = require('./Folder');
const Note = require('./Note');
const NoteLink = require('./NoteLink');
const Permission = require('./Permission');
const Complaint = require('./Complaint');
const Log = require('./Log');

// Связи на основе таблицы 2.14

// Users owns many Folders (Один ко многим)
User.hasMany(Folder, { foreignKey: 'owner_id', as: 'folders', onDelete: 'CASCADE' });
Folder.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Users owns many Notes
User.hasMany(Note, { foreignKey: 'owner_id', as: 'notes', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Folders parent many Folders (self-association, вложенность)
Folder.hasMany(Folder, { foreignKey: 'parent_id', as: 'children', onDelete: 'SET NULL' });
Folder.belongsTo(Folder, { foreignKey: 'parent_id', as: 'parent' });

// Folders contains many Notes
Folder.hasMany(Note, { foreignKey: 'folder_id', as: 'notes', onDelete: 'SET NULL' });
Note.belongsTo(Folder, { foreignKey: 'folder_id', as: 'folder' });

// Notes from many NoteLinks (Один ко многим для from_note_id)
Note.hasMany(NoteLink, { foreignKey: 'from_note_id', as: 'outgoingLinks', onDelete: 'CASCADE' });
NoteLink.belongsTo(Note, { foreignKey: 'from_note_id', as: 'fromNote' });

// Notes to many NoteLinks (Один ко многим для to_note_id)
Note.hasMany(NoteLink, { foreignKey: 'to_note_id', as: 'incomingLinks', onDelete: 'CASCADE' });
NoteLink.belongsTo(Note, { foreignKey: 'to_note_id', as: 'toNote' });

// Users grants_to many Permissions
User.hasMany(Permission, { foreignKey: 'user_id', as: 'permissions', onDelete: 'CASCADE' });
Permission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Полиморфные связи для Permissions (access_to Notes или Folders)
Permission.belongsTo(Note, { foreignKey: 'resource_id', targetKey: 'id', constraints: false, as: 'noteResource' });  // Для resource_type = 'note'
Permission.belongsTo(Folder, { foreignKey: 'resource_id', targetKey: 'id', constraints: false, as: 'folderResource' });  // Для 'folder'

// Users files many Complaints
User.hasMany(Complaint, { foreignKey: 'complainant_id', as: 'complaints', onDelete: 'SET NULL' });
Complaint.belongsTo(User, { foreignKey: 'complainant_id', as: 'complainant' });

// Полиморфные связи для Complaints (about Notes или Folders)
Complaint.belongsTo(Note, { foreignKey: 'resource_id', targetKey: 'id', constraints: false, as: 'noteAbout' });
Complaint.belongsTo(Folder, { foreignKey: 'resource_id', targetKey: 'id', constraints: false, as: 'folderAbout' });

// Users performs many Logs
User.hasMany(Log, { foreignKey: 'user_id', as: 'logs', onDelete: 'SET NULL' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Экспорт моделей для использования в приложении
module.exports = {
  User,
  Folder,
  Note,
  NoteLink,
  Permission,
  Complaint,
  Log,
  sequelize,
};