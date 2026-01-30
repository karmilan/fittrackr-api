import mongoose from 'mongoose';

const WorkoutLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('WorkoutLog', WorkoutLogSchema);
