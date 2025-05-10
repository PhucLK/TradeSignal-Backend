import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    signals: {
      type: [String],
      enum: ['BUY', 'SELL', 'HOLD'],
      default: ['BUY', 'SELL']
    },
    timeframes: {
      type: [String],
      enum: ['1m', '5m', '15m', '1h', '4h', '1d'],
      default: ['1h', '4h', '1d']
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'notificationPreferences.signals': 1 });

const User = mongoose.model('User', userSchema);

export default User; 