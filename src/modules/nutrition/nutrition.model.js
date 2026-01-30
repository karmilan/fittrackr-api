import mongoose from 'mongoose';

const NutritionLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    calories: { type: Number, required: true },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model('NutritionLog', NutritionLogSchema);
