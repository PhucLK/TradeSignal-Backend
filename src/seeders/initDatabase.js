import User from '../models/User.js';
import Signal from '../models/Signal.js';
import SignalStats from '../models/SignalStats.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';

const defaultUser = {
  email: 'admin@tradesignal.com',
  password: 'admin123',
  favorites: ['BTC', 'ETH', 'BNB'],
  notificationPreferences: {
    email: true,
    push: true,
    signals: ['BUY', 'SELL'],
    timeframes: ['1h', '4h', '1d']
  }
};

const defaultSignals = [
  {
    coin: 'BTC',
    indicator: 'RSI',
    signalType: 'BUY',
    timeframe: '1h',
    price: 50000,
    strength: 75
  },
  {
    coin: 'ETH',
    indicator: 'MACD',
    signalType: 'SELL',
    timeframe: '4h',
    price: 3000,
    strength: 60
  },
  {
    coin: 'BNB',
    indicator: 'BB',
    signalType: 'HOLD',
    timeframe: '1d',
    price: 400,
    strength: 45
  }
];

const defaultStats = [
  {
    coin: 'BTC',
    timeframe: '1h',
    signalType: 'BUY',
    count: 100,
    successRate: 75,
    averagePrice: 50000
  },
  {
    coin: 'ETH',
    timeframe: '4h',
    signalType: 'SELL',
    count: 80,
    successRate: 65,
    averagePrice: 3000
  }
];

const defaultToken = {
  userId: 'DefaultUserId',
  token: 'default-token',
};

const initDatabase = async () => {
  try {
    // Check if default user exists
    const existingUser = await User.findOne({ email: defaultUser.email });
    if (!existingUser) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultUser.password, salt);
      
      // Create default user
      await User.create({
        ...defaultUser,
        password: hashedPassword
      });
      console.log('Default user created successfully');
    }

    // Check if signals exist
    const signalCount = await Signal.countDocuments();
    if (signalCount === 0) {
      await Signal.insertMany(defaultSignals);
      console.log('Default signals created successfully');
    }

    // Check if stats exist
    const statsCount = await SignalStats.countDocuments();
    if (statsCount === 0) {
      await SignalStats.insertMany(defaultStats);
      console.log('Default stats created successfully');
    }

    // Check if default token exists
    const existingToken = await Token.findOne({ userId: defaultToken.userId, token: defaultToken.token });
    if (!existingToken) {
      await Token.create(defaultToken);
      console.log('Default token created successfully');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initDatabase;