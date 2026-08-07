const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post(
    '/register',
    [
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage('Full name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Full name must be between 2 and 100 characters'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),

        body('mobile')
            .trim()
            .notEmpty()
            .withMessage('Mobile number is required')
            .matches(/^[6-9]\d{9}$/)
            .withMessage('Please provide a valid 10-digit Indian mobile number'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        body('referralCode')
            .optional()
            .trim()
            .isLength({ min: 8, max: 8 })
            .withMessage('Referral code must be exactly 8 characters')
            .toUpperCase(),
    ],
    validate,
    authController.register
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
    '/login',
    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
    validate,
    authController.login
);

// AFTER

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post(
    '/forgot-password',
    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
    ],
    validate,
    authController.forgotPassword
);

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post(
    '/reset-password',
    [
        body('token')
            .notEmpty()
            .withMessage('Reset token is required'),

        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    ],
    validate,
    authController.resetPassword
);

module.exports = router;