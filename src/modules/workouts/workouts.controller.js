import WorkoutLog from './workouts.model.js';

export const getWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;

        const workouts = await WorkoutLog.find({ userId })
            .sort({ date: -1 })
            .limit(limit);

        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const logWorkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, durationMinutes, caloriesBurned, notes, date } = req.body;

        const newWorkout = new WorkoutLog({
            userId,
            type,
            durationMinutes,
            caloriesBurned,
            notes,
            date: date || new Date()
        });

        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
