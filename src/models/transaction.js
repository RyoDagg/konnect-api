const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./user');
const Wallet = require('./wallet');

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: { type: DataTypes.ENUM('send', 'request'), allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending',
    },
  },
  { timestamps: true }
);

Transaction.belongsTo(User, { as: 'sender' });
Transaction.belongsTo(User, { as: 'receiver' });
Transaction.belongsTo(Wallet);

module.exports = Transaction;
