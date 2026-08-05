const Investment = require('../models/Investment');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Create Investment ────────────────────────────────────────────────────────
// POST /api/investments
const createInvestment = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        // Determine which plan fits the investment amount
        const planData = Investment.getPlanForAmount(amount);

        if (!planData) {
            return errorResponse(
                res,
                400,
                'Investment amount does not match any available plan. between ₹1,000 and ₹1,00,00,000.'
            );
        }

        // Create investment with plan snapshot
        const investment = await Investment.create({
            user: userId,
            amount,
            plan: {
                planId: planData.planId,
                planName: planData.name,
                dailyROIPercentage: planData.dailyROIPercentage,
                durationDays: planData.durationDays,
            },
            startDate: new Date(),
        });

        return successResponse(res, 201, 'Investment created successfully.', {
            investment,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get User Investments ─────────────────────────────────────────────────────
// GET /api/investments
const getUserInvestments = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Support optional status filter via query param: ?status=Active
        const filter = { user: userId };
        if (req.query.status) {
            const validStatuses = ['Active', 'Completed', 'Cancelled'];
            if (!validStatuses.includes(req.query.status)) {
                return errorResponse(res, 400, 'Invalid status filter. Use Active, Completed, or Cancelled.');
            }
            filter.status = req.query.status;
        }

        const investments = await Investment.find(filter).sort({ createdAt: -1 });

        return successResponse(res, 200, 'Investments fetched successfully.', {
            count: investments.length,
            investments,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get Single Investment ────────────────────────────────────────────────────
// GET /api/investments/:id
const getInvestmentById = async (req, res, next) => {
    try {
        const investment = await Investment.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!investment) {
            return errorResponse(res, 404, 'Investment not found.');
        }

        return successResponse(res, 200, 'Investment fetched successfully.', {
            investment,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createInvestment, getUserInvestments, getInvestmentById };