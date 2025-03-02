const express = require('express');
const passport = require('passport');
const router = express.Router();
const Wallet = require('../models/wallet');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const wallet = await Wallet.findOne({ where: { UserId: req.user.id } });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
      res.json(wallet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
