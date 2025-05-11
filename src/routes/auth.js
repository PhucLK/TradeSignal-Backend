import express from 'express';
import User from '../models/User.js';
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  console.log('Registering user');
  console.log(req.body);
  
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
    // const firebaseUser = await admin.auth().createUser({
    //   email,
    //   password
    // });

    res.status(201).json({
      message: 'User created successfully',
      // uid: firebaseUser.uid,
      success : true,
      userId: user._id // Include the MongoDB user ID
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

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Firebase token
    // const firebaseToken = await admin.auth().createCustomToken(user.email);

    // Call registerForPushNotifications (placeholder for actual implementation)
    // You can replace this with the actual logic to register the device for push notifications
    console.log('registerForPushNotifications called for user:', user.email);

    res.json({
      message: 'Login successful',
      // firebaseToken,
      success : true,
      userId: user._id // Include the MongoDB user ID
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

export default router;