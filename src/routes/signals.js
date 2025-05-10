import express from 'express';
import Signal from '../models/Signal.js';
import SignalStats from '../models/SignalStats.js';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all signals with pagination
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, coin, signalType, timeframe } = req.query;
    const query = {};

    if (coin) query.coin = coin;
    if (signalType) query.signalType = signalType;
    if (timeframe) query.timeframe = timeframe;

    const signals = await Signal.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Signal.countDocuments(query);

    res.json({
      signals,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching signals:', error);
    res.status(500).json({ message: 'Error fetching signals' });
  }
});

// Get signal statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { coin, timeframe, signalType } = req.query;
    const query = {};

    if (coin) query.coin = coin;
    if (timeframe) query.timeframe = timeframe;
    if (signalType) query.signalType = signalType;

    const stats = await SignalStats.find(query);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching signal stats:', error);
    res.status(500).json({ message: 'Error fetching signal stats' });
  }
});

// Create a new signal
router.post('/', verifyToken, async (req, res) => {
  try {
    const signal = new Signal(req.body);
    await signal.save();
    res.status(201).json(signal);
  } catch (error) {
    console.error('Error creating signal:', error);
    res.status(400).json({ message: 'Error creating signal' });
  }
});

// Update signal status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const signal = await Signal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }
    
    res.json(signal);
  } catch (error) {
    console.error('Error updating signal status:', error);
    res.status(400).json({ message: 'Error updating signal status' });
  }
});

// Add a coin to the favorite list
router.post('/favorites', verifyToken, async (req, res) => {
  try {
    const { coin } = req.body;
    if (!coin) {
      return res.status(400).json({ message: 'Coin is required' });
    }

    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      user.uid,
      { $addToSet: { favorites: coin } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error adding coin to favorites:', error);
    res.status(500).json({ message: 'Error adding coin to favorites' });
  }
});

// Search for coins
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const coins = await Signal.find({ coin: { $regex: query, $options: 'i' } });
    res.json(coins);
  } catch (error) {
    console.error('Error searching for coins:', error);
    res.status(500).json({ message: 'Error searching for coins' });
  }
});

export default router;