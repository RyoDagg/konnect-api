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

module.exports = router;
