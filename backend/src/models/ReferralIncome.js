const mongoose = require('mongoose');

const referralIncomeSchema = new mongoose.Schema(
    {
        // The user who RECEIVES this income (ancestor in referral tree)
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Recipient user is required'],
        },

        // The user whose ROI event TRIGGERED this income (descendant in tree)
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Source user is required'],
        },

        // The investment that generated the ROI which triggered this level income
        investment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investment',
            required: [true, 'Investment reference is required'],
        },

        // How many levels up from generatedBy this recipient sits
        level: {
            type: Number,
            required: [true, 'Referral level is required'],
            min: 1,
            max: 5,
        },

        // What percentage was applied at this level
        percentage: {
            type: Number,
            required: [true, 'Percentage is required'],
        },

        // Actual amount credited to recipient wallet in rupees
        amount: {
            type: Number,
            required: [true, 'Income amount is required'],
            min: [0, 'Income amount cannot be negative'],
        },

        // Date this income was credited (normalized to midnight for grouping)
        creditedDate: {
            type: Date,
            required: [true, 'Credited date is required'],
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Fetch all referral income for a user sorted by most recent
referralIncomeSchema.index({ recipient: 1, creditedDate: -1 });

// Used when building level breakdown reports per user
referralIncomeSchema.index({ recipient: 1, level: 1 });

// Used by cron to check if level income was already credited
// for this specific investment on this specific date
referralIncomeSchema.index({ generatedBy: 1, investment: 1, creditedDate: 1 });

module.exports = mongoose.model('ReferralIncome', referralIncomeSchema);