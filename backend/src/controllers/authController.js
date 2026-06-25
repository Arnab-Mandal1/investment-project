const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Helper: Generate JWT token ───────────────────────────────────────────────
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
};

// ─── Register ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { fullName, email, mobile, password, referralCode } = req.body;

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return errorResponse(res, 400, 'Email already registered. Please login.');
        }

        // Check if mobile already exists
        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return errorResponse(res, 400, 'Mobile number already registered.');
        }

        // If referral code provided, find the referring user
        let referredBy = null;
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (!referrer) {
                return errorResponse(res, 400, 'Invalid referral code.');
            }
            referredBy = referrer._id;
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            mobile,
            password,
            referredBy,
        });

        // Generate JWT token
        const token = generateToken(user._id);

        return successResponse(res, 201, 'Registration successful.', {
            token,
            user: user.toPublicJSON(),
        });
    } catch (error) {
        next(error);
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email — explicitly include password field (select: false by default)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Intentionally vague message — don't reveal if email exists or not
            return errorResponse(res, 401, 'Invalid email or password.');
        }

        // Check if account is active before allowing login
        if (user.accountStatus !== 'Active') {
            return errorResponse(res, 403, 'Account is suspended or inactive.');
        }

        // Compare provided password with stored hash
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return errorResponse(res, 401, 'Invalid email or password.');
        }

        // Generate JWT token
        const token = generateToken(user._id);

        return successResponse(res, 200, 'Login successful.', {
            token,
            user: user.toPublicJSON(),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };