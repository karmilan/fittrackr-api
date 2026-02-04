import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fittrackr';

/**
 * Global variables to cache the database connection and promise.
 * This is crucial for serverless environments like Vercel.
 */
let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = (async () => {
        try {
            console.log('Connecting to MongoDB...');
            const conn = await mongoose.connect(MONGO_URI);

            cachedConnection = conn;
            console.log(`MongoDB Connected: ${conn.connection.host || 'Atlas'}`);
            return conn;
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            connectionPromise = null; // Reset promise on error so we can try again
            throw error;
        }
    })();

    return connectionPromise;
};

export default connectDB;
