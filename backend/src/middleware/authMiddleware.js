const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    try {
        // Step 1: Check if Authorization header exists and has correct format
        // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, 'Access denied. No token provided.');
        }

        // Step 2: Extract the token — remove "Bearer " prefix (7 characters)
        const token = authHeader.split(' ')[1];

        if (!token) {
            return errorResponse(res, 401, 'Access denied. Invalid token format.');
        }

        // Step 3: Verify token signature and expiry using our JWT secret
        // jwt.verify throws an error if token is invalid or expired
        const decoded = jwt.verify(token, env.JWT_SECRET);

        // Step 4: Check if user still exists in database
        // Token could be valid but user might have been deleted or suspended
        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 401, 'Access denied. User no longer exists.');
        }

        // Step 5: Check if account is active
        if (user.accountStatus !== 'Active') {
            return errorResponse(res, 403, 'Access denied. Account is suspended or inactive.');
        }

        // Step 6: Attach user to request object so controllers can access it
        req.user = user;

        // Step 7: Move to next middleware or controller
        next();
    } catch (error) {
        // jwt.verify throws specific errors we can handle
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, 401, 'Access denied. Invalid token.');
        }

        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Access denied. Token has expired. Please login again.');
        }

        return errorResponse(res, 500, 'Internal server error during authentication.');
    }
};

module.exports = { protect };