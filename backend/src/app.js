const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const investmentRoutes = require('./routes/investment');
const dashboardRoutes = require('./routes/dashboard');
const referralRoutes = require('./routes/referral');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

// Enable CORS — allows frontend (port 3000) to call backend (port 5000)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true,
}));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referral', referralRoutes);

// ─── 404 Handler — unknown routes ─────────────────────────────────────────────
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

app.use(errorHandler);

module.exports = app;