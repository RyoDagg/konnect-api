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
    const transactions = [
      {
        type: 'send',
        amount: 100,
        status: 'completed',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
      {
        type: 'send',
        amount: 200,
        status: 'completed',
        senderId: user2.id,
        receiverId: user1.id,
        WalletId: wallet2.id,
      },
      {
        type: 'send',
        amount: 50,
        status: 'completed',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
      {
        type: 'request',
        amount: 300,
        status: 'pending',
        senderId: user2.id,
        receiverId: user1.id,
        WalletId: wallet2.id,
      },
      {
        type: 'send',
        amount: 75,
        status: 'completed',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
      {
        type: 'send',
        amount: 150,
        status: 'completed',
        senderId: user2.id,
        receiverId: user1.id,
        WalletId: wallet2.id,
      },
      {
        type: 'send',
        amount: 250,
        status: 'completed',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
      {
        type: 'request',
        amount: 400,
        status: 'pending',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
      {
        type: 'send',
        amount: 125,
        status: 'completed',
        senderId: user2.id,
        receiverId: user1.id,
        WalletId: wallet2.id,
      },
      {
        type: 'send',
        amount: 175,
        status: 'completed',
        senderId: user1.id,
        receiverId: user2.id,
        WalletId: wallet1.id,
      },
    ];

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
