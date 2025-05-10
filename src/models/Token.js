import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
}, {
    timestamps: true
});

// Index for faster queries
tokenSchema.index({ userId: 1 });

const Token = mongoose.model('Token', tokenSchema);

export default Token; 