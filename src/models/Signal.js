import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  indicator: {
    type: String,
    required: true,
    trim: true
  },
  signalType: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL', 'HOLD']
  },
  timeframe: {
    type: String,
    required: true,
    enum: ['1m', '5m', '15m', '1h', '4h', '1d']
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  strength: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// Index for faster queries
signalSchema.index({ coin: 1, timestamp: -1 });
signalSchema.index({ signalType: 1, status: 1 });

const Signal = mongoose.model('Signal', signalSchema);

export default Signal; 