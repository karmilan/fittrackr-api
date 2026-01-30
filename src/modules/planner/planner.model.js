import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true }
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    intensity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    description: { type: String, required: true }
}, { _id: false });

const DailyPlanSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    calorieTarget: { type: Number, required: true },
    meals: [MealSchema],
    workout: WorkoutSchema
}, { timestamps: true });

// Ensure one plan per user per day
DailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyPlan', DailyPlanSchema);
