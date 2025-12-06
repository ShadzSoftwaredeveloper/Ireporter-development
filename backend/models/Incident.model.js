const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('red-flag', 'intervention'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value.lat || !value.lng) {
          throw new Error('Location must include lat and lng coordinates');
        }
      }
    }
  },
  media: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'under-investigation', 'resolved', 'rejected'),
    defaultValue: 'under-investigation',
    allowNull: false
  },
  adminComment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Incident;
