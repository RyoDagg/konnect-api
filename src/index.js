/**
 * Production-Ready Express.js Wallet API
 * Features:
 * ✅ JWT Authentication (Passport.js)
 * ✅ MySQL with Sequelize ORM
 * ✅ Users, Wallets, Transactions
 * ✅ Secure Password Hashing
 * ✅ Protected Routes
 * ✅ Error Handling & Validation
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const sequelize = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use(
  session({
    secret: 'your_secret_key', // Replace with your own secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./services/passport')(app);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Wallet API!');
});

app.use('/user', require('./controllers/user'));
app.use('/wallet', require('./controllers/wallet'));
app.use('/transactions', require('./controllers/transaction'));

// Sync Database & Start Server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection failed', err));
