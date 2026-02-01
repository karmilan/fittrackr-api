import * as plannerService from './planner.service.js';

export const generateDailyPlan = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { date } = req.body;
        // Parse date from body or default to today
        const planDate = date ? new Date(date) : new Date();

        // Basic validation
        if (isNaN(planDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const plan = await plannerService.generatePlan(userId, planDate);
        res.status(200).json(plan);
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ message: 'Failed to generate plan', error: error.message });
    }
};

export const getDailyPlan = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { date } = req.query;
        const planDate = date ? new Date(date) : new Date();

        if (isNaN(planDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const plan = await plannerService.getPlan(userId, planDate);

        if (!plan) {
            return res.status(404).json({ message: 'No plan found for this date.' });
        }

        res.status(200).json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Failed to fetch plan', error: error.message });
    }
};
