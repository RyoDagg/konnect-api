const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');
require('dotenv').config();

module.exports = function (app) {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  app.use(passport.initialize());
};
