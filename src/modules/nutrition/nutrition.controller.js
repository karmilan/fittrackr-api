import NutritionLog from './nutrition.model.js';

export const getNutritionLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const dateParam = req.query.date;

        let query = { userId };

        // Filter by specific date if provided (YYYY-MM-DD)
        if (dateParam) {
            const start = new Date(dateParam);
            const end = new Date(dateParam);
            end.setDate(end.getDate() + 1);
            query.date = { $gte: start, $lt: end };
        }

        const logs = await NutritionLog.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const logNutrition = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calories, protein, carbs, fats, mealType, date } = req.body;

        const newLog = new NutritionLog({
            userId,
            calories,
            protein,
            carbs,
            fats,
            mealType,
            date: date || new Date()
        });

        await newLog.save();
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getDailySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        // Today's Date range
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const logs = await NutritionLog.find({
            userId,
            date: { $gte: start, $lte: end }
        });

        const summary = logs.reduce((acc, log) => {
            acc.calories += log.calories || 0;
            acc.protein += log.protein || 0;
            acc.carbs += log.carbs || 0;
            acc.fats += log.fats || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
