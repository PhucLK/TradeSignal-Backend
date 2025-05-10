import express from 'express';
import User from '../models/User.js';
import admin from 'firebase-admin';

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

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      email: user.email,
      favorites: user.favorites,
      notificationPreferences: user.notificationPreferences
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user favorites
router.post('/favorites', verifyToken, async (req, res) => {
  try {
    const { coin, action } = req.body;
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add' && !user.favorites.includes(coin)) {
      user.favorites.push(coin);
    } else if (action === 'remove') {
      user.favorites = user.favorites.filter(fav => fav !== coin);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

// Get notification preferences
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ preferences: user.notificationPreferences });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ message: 'Error fetching notification preferences' });
  }
});

// Update notification preferences
router.post('/notifications', verifyToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notificationPreferences = preferences;
    await user.save();
    res.json({ preferences: user.notificationPreferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Error updating notification preferences' });
  }
});

export default router; 