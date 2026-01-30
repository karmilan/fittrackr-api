import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    height: { type: Number, required: true },
    startingWeight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    weeklyGoal: { type: Number, required: true },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
        default: 'moderately_active'
    }
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
