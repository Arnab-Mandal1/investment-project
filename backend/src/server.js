const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const { startCronJobs } = require('./services/cronService');

const startServer = async () => {
    try {
        await connectDB();

        // Start cron jobs after DB is connected
        startCronJobs();

        const server = app.listen(env.PORT, () => {
            console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
            console.log(`Health check: http://localhost:${env.PORT}/api/health`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();