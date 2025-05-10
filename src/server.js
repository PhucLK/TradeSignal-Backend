import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import admin from 'firebase-admin';
import initDatabase from './seeders/initDatabase.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import signalRoutes from './routes/signals.js';
import healthRoutes from './routes/health.js';

// Import services
import signalAnalyzer from './services/signalAnalyzer.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    initDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/ok', healthRoutes);

// Schedule signal analysis
cron.schedule('*/15 * * * *', () => {
  signalAnalyzer.analyzeSignals();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});