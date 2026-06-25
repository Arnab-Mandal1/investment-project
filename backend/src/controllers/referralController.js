const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const { successResponse } = require('../utils/apiResponse');

// ─── Get Direct Referrals ─────────────────────────────────────────────────────
// GET /api/referral/direct
const getDirectReferrals = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Find all users who were directly referred by this user
        const directReferrals = await User.find({ referredBy: userId })
            .select('fullName email mobile referralCode walletBalance accountStatus createdAt')
            .sort({ createdAt: -1 });

        // For each referral, get their total investment amount
        const referralsWithStats = await Promise.all(
            directReferrals.map(async (referral) => {
                const Investment = require('../models/Investment');
                const investments = await Investment.find({ user: referral._id });
                const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

                return {
                    id: referral._id,
                    fullName: referral.fullName,
                    email: referral.email,
                    mobile: referral.mobile,
                    referralCode: referral.referralCode,
                    accountStatus: referral.accountStatus,
                    totalInvested,
                    joinedAt: referral.createdAt,
                };
            })
        );

        return successResponse(res, 200, 'Direct referrals fetched successfully.', {
            count: referralsWithStats.length,
            referrals: referralsWithStats,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get Complete Referral Tree ───────────────────────────────────────────────
// GET /api/referral/tree
const getReferralTree = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Build tree recursively up to MAX_REFERRAL_LEVELS deep
        const tree = await buildReferralTree(userId, 1);

        // Get referral income summary by level
        const levelIncomeSummary = await ReferralIncome.aggregate([
            { $match: { recipient: userId } },
            {
                $group: {
                    _id: '$level',
                    totalIncome: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return successResponse(res, 200, 'Referral tree fetched successfully.', {
            tree,
            levelIncomeSummary,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Helper: Recursively build referral tree ──────────────────────────────────
const buildReferralTree = async (userId, currentLevel) => {
    const env = require('../config/env');

    // Stop recursion when max level reached
    if (currentLevel > env.MAX_REFERRAL_LEVELS) return [];

    // Find all direct referrals of this user
    const children = await User.find({ referredBy: userId })
        .select('fullName email referralCode accountStatus createdAt');

    // For each child, recursively get their referrals
    const childrenWithSubTree = await Promise.all(
        children.map(async (child) => ({
            id: child._id,
            fullName: child.fullName,
            email: child.email,
            referralCode: child.referralCode,
            accountStatus: child.accountStatus,
            joinedAt: child.createdAt,
            level: currentLevel,
            // Recursively get this child's referrals
            children: await buildReferralTree(child._id, currentLevel + 1),
        }))
    );

    return childrenWithSubTree;
};

module.exports = { getDirectReferrals, getReferralTree };