import mongoose from 'mongoose';

const signalStatsSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  timeframe: {
    type: String,
    required: true,
    enum: ['1m', '5m', '15m', '1h', '4h', '1d']
  },
  signalType: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL', 'HOLD']
  },
  count: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  averagePrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for faster queries
signalStatsSchema.index({ coin: 1, timeframe: 1, signalType: 1 }, { unique: true });

const SignalStats = mongoose.model('SignalStats', signalStatsSchema);

export default SignalStats; 