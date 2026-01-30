import * as plannerService from './planner.service.js';

// In a real app with auth, this would come from req.user
const DEFAULT_USER_ID = 'local_user';

export const generateDailyPlan = async (req, res) => {
    try {
        const { date } = req.body;
        // Parse date from body or default to today
        const planDate = date ? new Date(date) : new Date();

        // Basic validation
        if (isNaN(planDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const plan = await plannerService.generatePlan(DEFAULT_USER_ID, planDate);
        res.status(200).json(plan);
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ message: 'Failed to generate plan', error: error.message });
    }
};

export const getDailyPlan = async (req, res) => {
    try {
        const { date } = req.query;
        const planDate = date ? new Date(date) : new Date();

        if (isNaN(planDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const plan = await plannerService.getPlan(DEFAULT_USER_ID, planDate);

        if (!plan) {
            return res.status(404).json({ message: 'No plan found for this date.' });
        }

        res.status(200).json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Failed to fetch plan', error: error.message });
    }
};
