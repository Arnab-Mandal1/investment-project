const express = require('express');
const { body, param } = require('express-validator');
const investmentController = require('../controllers/investmentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

// ─── POST /api/investments ────────────────────────────────────────────────────
router.post(
    '/',
    protect,
    [
        body('amount')
            .notEmpty()
            .withMessage('Investment amount is required')
            .isNumeric()
            .withMessage('Investment amount must be a number')
            .custom((value) => {
                if (value < 1000) {
                    throw new Error('Minimum investment amount is ₹1,000');
                }
                return true;
            }),
    ],
    validate,
    investmentController.createInvestment
);

// ─── GET /api/investments ─────────────────────────────────────────────────────
router.get(
    '/',
    protect,
    investmentController.getUserInvestments
);

// ─── GET /api/investments/:id ─────────────────────────────────────────────────
router.get(
    '/:id',
    protect,
    [
        param('id')
            .notEmpty()
            .withMessage('Investment ID is required')
            .isMongoId()
            .withMessage('Invalid investment ID format'),
    ],
    validate,
    investmentController.getInvestmentById
);

module.exports = router;