const User = require('../models/User');
const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const ReferralIncome = require('../models/ReferralIncome');
const { successResponse } = require('../utils/apiResponse');

// ─── Get Dashboard Stats ──────────────────────────────────────────────────────
// GET /api/dashboard
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [
            user,
            investments,
            todayROI,
            recentROIHistory,
            recentReferralIncome,
        ] = await Promise.all([
            // Fresh user data with wallet and income totals
            User.findById(userId),

            // All investments for this user
            Investment.find({ user: userId }).sort({ createdAt: -1 }),

            // Today's ROI across all investments
            ROIHistory.aggregate([
                {
                    $match: {
                        user: userId,
                        creditedDate: {
                            $gte: getStartOfDay(),
                            $lte: getEndOfDay(),
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                    },
                },
            ]),

            // Last 10 ROI history records
            ROIHistory.find({ user: userId })
                .sort({ creditedDate: -1 })
                .limit(10)
                .populate('investment', 'amount plan status'),

            // Last 10 referral income records
            ReferralIncome.find({ recipient: userId })
                .sort({ creditedDate: -1 })
                .limit(10)
                .populate('generatedBy', 'fullName email'),
        ]);

        // Calculate total invested amount across all investments
        const totalInvested = investments.reduce(
            (sum, inv) => sum + inv.amount,
            0
        );

        // Calculate active investments count and total active amount
        const activeInvestments = investments.filter(
            (inv) => inv.status === 'Active'
        );

        return successResponse(res, 200, 'Dashboard data fetched successfully.', {
            summary: {
                walletBalance: user.walletBalance,
                totalROIEarned: user.totalROIEarned,
                totalLevelIncomeEarned: user.totalLevelIncomeEarned,
                totalInvested,
                todayROI: todayROI[0]?.total || 0,
                activeInvestmentsCount: activeInvestments.length,
                totalInvestmentsCount: investments.length,
            },
            recentROIHistory,
            recentReferralIncome,
            investments,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Helpers: Get start and end of today (midnight UTC) ───────────────────────
const getStartOfDay = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
};

const getEndOfDay = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
};

module.exports = { getDashboardStats };