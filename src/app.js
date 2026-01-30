import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import profileRoutes from './modules/profile/profile.routes.js';
import weightRoutes from './modules/weight/weight.routes.js';
import workoutRoutes from './modules/workouts/workouts.routes.js';
import nutritionRoutes from './modules/nutrition/nutrition.routes.js';
import plannerRoutes from './modules/planner/planner.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/planner', plannerRoutes);

// Error Handling
app.use(errorHandler);

export default app;
