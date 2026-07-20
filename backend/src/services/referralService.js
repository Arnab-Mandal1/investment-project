const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const env = require('../config/env');

/**
 * Distribute level income to all eligible ancestors when a user earns ROI.
 * Traverses up the referral tree level by level.
 * @param {object} investment - The investment that generated ROI
 * @param {number} roiAmount - The ROI amount that was credited
 * @param {Date} today - Normalized midnight date for idempotency
 */
const distributeReferralIncome = async (investment, roiAmount, today) => {
    try {
        // Start from the user who owns the investment
        const investorId = investment.user._id || investment.user;

        // Get the investor to find their referrer
        const investor = await User.findById(investorId).select('referredBy');

        // If investor has no referrer, no level income to distribute
        if (!investor || !investor.referredBy) {
            return;
        }

        // Traverse up the tree level by level
        let currentUserId = investor.referredBy;
        let currentLevel = 1;

        while (currentUserId && currentLevel <= env.MAX_REFERRAL_LEVELS) {
            // Get the current ancestor
            const ancestor = await User.findById(currentUserId)
                .select('referredBy accountStatus walletBalance totalLevelIncomeEarned');

            // Skip if ancestor not found or account not active
            if (!ancestor || ancestor.accountStatus !== 'Active') {
                // Still traverse up even if this level is inactive
                currentUserId = ancestor ? ancestor.referredBy : null;
                currentLevel++;
                continue;
            }

            // Get percentage for this level
            const percentage = env.REFERRAL_PERCENTAGES[currentLevel - 1];

            // Calculate income amount
            // Formula: roiAmount * (levelPercentage / 100)
            const incomeAmount = parseFloat(
                (roiAmount * (percentage / 100)).toFixed(2)
            );

            // Check if this level income was already credited today
            // for this specific investment (idempotency check)
            const alreadyCredited = await ReferralIncome.findOne({
                generatedBy: investorId,
                investment: investment._id,
                creditedDate: today,
                level: currentLevel,
            });

            if (alreadyCredited) {
                console.log(
                    `Level ${currentLevel} income already credited for investment ${investment._id} — skipping`
                );
                currentUserId = ancestor.referredBy;
                currentLevel++;
                continue;
            }

            // Create referral income record
            await ReferralIncome.create({
                recipient: ancestor._id,
                generatedBy: investorId,
                investment: investment._id,
                level: currentLevel,
                percentage,
                amount: incomeAmount,
                creditedDate: today,
            });

            // Credit income to ancestor wallet
            await User.findByIdAndUpdate(ancestor._id, {
                $inc: {
                    walletBalance: incomeAmount,
                    totalLevelIncomeEarned: incomeAmount,
                },
            });

            console.log(
                `Level ${currentLevel} income of ₹${incomeAmount} credited to user ${ancestor._id}`
            );

            // Move up to next level
            currentUserId = ancestor.referredBy;
            currentLevel++;
        }
    } catch (error) {
        
        console.error('Error distributing referral income:', error.message);
    }
};

module.exports = { distributeReferralIncome };