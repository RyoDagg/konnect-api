const express = require('express');
const passport = require('passport');
const router = express.Router();
const Transaction = require('../models/transaction');
const { Op } = require('sequelize');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
      });

      if (!transactions)
        return res
          .status(404)
          .send({ ok: false, error: 'No transactions found.' });

      res.status(200).send({ ok: true, data: transactions });
    } catch (err) {
      res.status(500).send({ ok: false, error: err.message });
    }
  }
);

module.exports = router;
