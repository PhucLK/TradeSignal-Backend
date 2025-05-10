import express from 'express';
import User from '../models/User.js';
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      favorites: [],
      notificationPreferences: {
        email: true,
        push: true,
        signals: ['BUY', 'SELL'],
        timeframes: ['1h', '4h', '1d']
      }
    });

    await user.save();

    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email,
      password
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: firebaseUser.uid
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Update device token for push notifications
router.post('/device-token', async (req, res) => {
  try {
    const { token } = req.body;
    const authToken = req.headers.authorization?.split('Bearer ')[1];
    
    if (!authToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.deviceTokens) {
      user.deviceTokens = [];
    }

    if (!user.deviceTokens.includes(token)) {
      user.deviceTokens.push(token);
      await user.save();
    }

    res.json({ message: 'Device token updated successfully' });
  } catch (error) {
    console.error('Error updating device token:', error);
    res.status(500).json({ message: 'Error updating device token' });
  }
});

export default router; 