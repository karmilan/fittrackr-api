import mongoose from 'mongoose';

const WeightLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    weight: { type: Number, required: true },
    note: { type: String }
}, { timestamps: true });

// Ensure one entry per day per user (optional, but good for tracking)
WeightLogSchema.index({ userId: 1, date: 1 });

export default mongoose.model('WeightLog', WeightLogSchema);
