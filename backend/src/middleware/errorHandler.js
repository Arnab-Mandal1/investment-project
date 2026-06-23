const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    // Log error details in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // ─── Mongoose Validation Error ──────────────────────────────────────────────
    // Happens when document fails schema validation (required fields, min, max etc.)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Extract all validation messages into a clean array
        const messages = Object.values(err.errors).map((e) => e.message);
        message = messages.join(', ');
    }

    // ─── Mongoose Duplicate Key Error ───────────────────────────────────────────
    // Happens when unique field constraint is violated (email, mobile, referralCode)
    if (err.code === 11000) {
        statusCode = 400;
        // Extract which field caused the duplicate
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists. Please use a different ${field}.`;
    }

    // ─── Mongoose CastError ─────────────────────────────────────────────────────
    // Happens when invalid ObjectId is passed (e.g. /investments/not-valid-id)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // ─── JWT Errors ─────────────────────────────────────────────────────────────
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please login again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please login again.';
    }

    return errorResponse(res, statusCode, message);
};

module.exports = errorHandler;