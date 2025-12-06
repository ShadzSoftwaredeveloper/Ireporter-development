const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  incidentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  incidentTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('status-update', 'comment-added', 'new-incident'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  oldStatus: {
    type: DataTypes.ENUM('draft', 'under-investigation', 'resolved', 'rejected'),
    allowNull: true
  },
  newStatus: {
    type: DataTypes.ENUM('draft', 'under-investigation', 'resolved', 'rejected'),
    allowNull: true
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Notification;
