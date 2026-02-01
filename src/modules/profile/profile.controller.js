import Profile from './profile.model.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { height, startingWeight, targetWeight, weeklyGoal, activityLevel } = req.body;

        // Upsert profile
        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                userId,
                height,
                startingWeight,
                targetWeight,
                weeklyGoal,
                activityLevel
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
