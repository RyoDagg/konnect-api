const sequelize = require('./db');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

const seedDB = async () => {
  try {
    await sequelize.sync({ force: true }); // Drops tables & recreates them

    console.log('Database reset and synchronized.');

    // Hash passwords
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);

    // Create users
    const user1 = await User.create({
      username: 'Alice',
      email: 'alice@example.com',
      password: password1,
    });
    const user2 = await User.create({
      username: 'Bob',
      email: 'bob@example.com',
      password: password2,
    });

    // Create wallets for each user
    const wallet1 = await Wallet.create({ balance: 4872.55, UserId: user1.id });
    const wallet2 = await Wallet.create({ balance: 1657.42, UserId: user2.id });

    // Generate transactions (Alice sends to Bob, Bob sends to Alice)
    const transactions = [];
    for (let i = 0; i < 200; i++) {
      transactions.push({
        type: i % 2 === 0 ? 'send' : 'request',
        amount: Math.floor(Math.random() * 500) + 1,
        status: i % 3 === 0 ? 'completed' : 'pending',
        senderId: i % 2 === 0 ? user1.id : user2.id,
        receiverId: i % 2 === 0 ? user2.id : user1.id,
        WalletId: i % 2 === 0 ? wallet1.id : wallet2.id,
      });
    }

    await Transaction.bulkCreate(transactions);

    console.log(
      '✅ Database seeded successfully with users, wallets, and transactions.'
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit();
  }
};

// Run the seeding function
seedDB();
