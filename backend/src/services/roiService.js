const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const User = require('../models/User');
const { distributeReferralIncome } = require('./referralService');

const processDailyROI = async () => {
    console.log('Starting daily ROI processing...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Track results for logging
    const results = {
        processed: 0,
        skipped: 0,
        failed: 0,
        totalROIDistributed: 0,
    };

    try {
        // Fetch all active investments that haven't ended yet
        const activeInvestments = await Investment.find({
            status: 'Active',
            endDate: { $gte: today },
        }).populate('user', 'walletBalance totalROIEarned accountStatus');

        console.log(`Found ${activeInvestments.length} active investments`);

        // Process each investment one by one
        for (const investment of activeInvestments) {
            try {
                const wasProcessed = await processInvestmentROI(investment, today);

                if (wasProcessed) {
                    results.processed++;
                    results.totalROIDistributed += investment.amount *
                        (investment.plan.dailyROIPercentage / 100);
                } else {
                    results.skipped++;
                }
            } catch (error) {
                // Log individual failure but continue processing others
                console.error(
                    `Failed to process ROI for investment ${investment._id}:`,
                    error.message
                );
                results.failed++;
            }
        }

        console.log('Daily ROI processing complete:', results);
        return results;
    } catch (error) {
        console.error('Fatal error in processDailyROI:', error.message);
        throw error;
    }
};

/**
 * Process ROI for a single investment.
 * Returns true if ROI was credited, false if already processed (skipped).
 * @param {object} investment - Investment document
 * @param {Date} today - Normalized midnight date
 * @returns {boolean}
 */
const processInvestmentROI = async (investment, today) => {
    // Skip if user account is not active
    if (investment.user.accountStatus !== 'Active') {
        return false;
    }

    // Calculate ROI amount
    // Formula: principal * (dailyROIPercentage / 100)
    const roiAmount = parseFloat(
        (investment.amount * (investment.plan.dailyROIPercentage / 100)).toFixed(2)
    );

    // Try to create ROI history record
    // The unique index on (investment + creditedDate) will throw if already exists
    try {
        await ROIHistory.create({
            user: investment.user._id,
            investment: investment._id,
            amount: roiAmount,
            creditedDate: today,
            status: 'Credited',
        });
    } catch (error) {
        // Duplicate key error (code 11000) means ROI already credited today
        if (error.code === 11000) {
            console.log(
                `ROI already credited for investment ${investment._id} on ${today.toDateString()} — skipping`
            );
            return false;
        }
        throw error;
    }

    // Credit ROI to user wallet and update totals
    await User.findByIdAndUpdate(investment.user._id, {
        $inc: {
            walletBalance: roiAmount,
            totalROIEarned: roiAmount,
        },
    });

    // Update investment's total ROI paid
    await Investment.findByIdAndUpdate(investment._id, {
        $inc: { totalROIPaid: roiAmount },
    });

    // Check if investment has completed (endDate reached)
    await checkAndCompleteInvestment(investment, today);

    // Distribute referral/level income to upline users
    await distributeReferralIncome(investment, roiAmount, today);

    return true;
};

/**
 * Marks investment as Completed if endDate has been reached.
 * @param {object} investment - Investment document
 * @param {Date} today - Normalized midnight date
 */
const checkAndCompleteInvestment = async (investment, today) => {
    const endDate = new Date(investment.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (today >= endDate) {
        await Investment.findByIdAndUpdate(investment._id, {
            status: 'Completed',
        });
        console.log(`Investment ${investment._id} marked as Completed`);
    }
};

module.exports = { processDailyROI };