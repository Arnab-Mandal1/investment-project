const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

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

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
    try {
        console.log('[FORGOT PASSWORD] Request received for:', req.body.email);
        const { email } = req.body;
        const user = await User.findOne({ email });
        console.log('[FORGOT PASSWORD] User found:', !!user);

        // Always return success even if email not found — prevents email enumeration
        if (!user) {
            return successResponse(res, 200, 'If that email exists, a reset link has been sent.');
        }

        // Generate raw token and its hash
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        // Save hash + expiry to DB (1 hour)
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send email with raw token (never the hash)
        await sendPasswordResetEmail(user.email, rawToken, user.fullName)
        console.log('[FORGOT PASSWORD] Email sent successfully to:', user.email);

        return successResponse(res, 200, 'If that email exists, a reset link has been sent.');
    } catch (error) {
        console.error('Forgot password error:', error.message);
        return errorResponse(res, 500, 'Failed to send reset email. Please try again.');
    }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the incoming raw token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with matching token that hasn't expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return errorResponse(res, 400, 'Reset link is invalid or has expired.');
        }

        // Update password — pre-save hook will hash it
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return successResponse(res, 200, 'Password reset successful. You can now log in.');
    } catch (error) {
        console.error('Reset password error:', error.message);
        return errorResponse(res, 500, 'Failed to reset password. Please try again.');
    }
};

module.exports = { register, login, forgotPassword, resetPassword };