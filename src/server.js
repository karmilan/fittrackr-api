import app from './app.js';
import connectDB from './config/db.js';
import dns from 'node:dns';

// Set DNS servers for SRV record resolution if needed
dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
