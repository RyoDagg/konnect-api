const express = require('express');
const passport = require('passport');
const router = express.Router();
const Transaction = require('../models/transaction');
const { Op } = require('sequelize');
const User = require('../models/user');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query; // Default limit is 10, offset is 0

      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
        limit: parseInt(limit), // Convert limit to a number
        offset: parseInt(offset), // Convert offset to a number
        sort: [['createdAt', 'DESC']],
      });

      if (!transactions || transactions.length === 0)
        return res
          .status(404)
          .send({ ok: false, error: 'No transactions found.' });

      res.status(200).send({ ok: true, data: transactions });
    } catch (err) {
      res.status(500).send({ ok: false, error: err.message });
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: {
          id: req.params.id,
          [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
        include: [
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
      });

      if (!transaction)
        return res
          .status(404)
          .send({ ok: false, error: 'Transaction not found.' });

      res.status(200).send({ ok: true, data: transaction });
    } catch (err) {
      res.status(500).send({ ok: false, error: err.message });
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { type, amount, receiverId } = req.body;

      if (!type || !amount || !receiverId)
        return res
          .status(400)
          .send({ ok: false, error: 'Missing required fields.' });

      if (req.user.id === receiverId)
        return res
          .status(400)
          .send({ ok: false, error: 'You cannot send money to yourself.' });

      const sender = await User.findOne({ where: { id: req.user.id } });
      const receiver = await User.findOne({ where: { id: receiverId } });

      if (!sender || !receiver)
        return res
          .status(404)
          .send({ ok: false, error: 'Sender or receiver not found.' });

      if (sender.wallet.balance < amount)
        return res
          .status(400)
          .send({ ok: false, error: 'Insufficient balance.' });

      const transaction = await Transaction.create({
        type,
        amount,
        senderId: req.user.id,
        // receiverId,
      });

      sender.wallet.balance -= amount;
      receiver.wallet.balance += amount;

      await sender.wallet.save();
      await receiver.wallet.save();

      res.status(201).send({ ok: true, data: transaction });
    } catch (err) {
      res.status(500).send({ ok: false, error: err.message });
    }
  }
);

module.exports = router;
