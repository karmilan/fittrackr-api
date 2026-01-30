import WeightLog from './weight.model.js';

const getUserId = () => 'user-123';

export const getWeightHistory = async (req, res) => {
    try {
        const userId = getUserId();
        const limit = parseInt(req.query.limit) || 30;

        const logs = await WeightLog.find({ userId })
            .sort({ date: -1 })
            .limit(limit);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const logWeight = async (req, res) => {
    try {
        const userId = getUserId();
        const { weight, note, date } = req.body;

        const newLog = new WeightLog({
            userId,
            weight,
            note,
            date: date || new Date()
        });

        await newLog.save();
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Simple stats endpoint
export const getWeightStats = async (req, res) => {
    try {
        const userId = getUserId();
        const logs = await WeightLog.find({ userId }).sort({ date: 1 });

        if (logs.length === 0) {
            return res.json({ current: 0, start: 0, totalLoss: 0, progress: [] });
        }

        const current = logs[logs.length - 1].weight;
        const start = logs[0].weight; // Assuming first log is start, or fetch from profile
        const totalLoss = start - current;

        res.json({
            current,
            start,
            totalLoss,
            logs // Return full history for charts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
