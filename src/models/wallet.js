const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./user');

const Wallet = sequelize.define(
  'Wallet',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  },
  { timestamps: true }
);

Wallet.belongsTo(User);
User.hasOne(Wallet, { foreignKey: 'UserId', as: 'wallet' });

module.exports = Wallet;
