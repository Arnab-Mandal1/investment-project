const mongoose = require('mongoose');

const INVESTMENT_PLANS = {
    basic: {
        name: 'Basic Plan',
        minAmount: 1000,
        maxAmount: 9999,
        dailyROIPercentage: 1.0,
        durationDays: 90,
    },
    silver: {
        name: 'Silver Plan',
        minAmount: 10000,
        maxAmount: 49999,
        dailyROIPercentage: 1.5,
        durationDays: 90,
    },
    gold: {
        name: 'Gold Plan',
        minAmount: 50000,
        maxAmount: 199999,
        dailyROIPercentage: 2.0,
        durationDays: 90,
    },
    platinum: {
        name: 'Platinum Plan',
        minAmount: 200000,
        maxAmount: Infinity,
        dailyROIPercentage: 2.5,
        durationDays: 90,
    },
};

const investmentSchema = new mongoose.Schema(
    {
        // The user who made this investment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },

        // Amount invested in rupees
        amount: {
            type: Number,
            required: [true, 'Investment amount is required'],
            min: [1000, 'Minimum investment amount is ₹1,000'],
        },

        // Snapshot of plan at time of investment
        // We store this so future plan changes don't affect existing investments
        plan: {
            planId: {
                type: String,
                required: true,
                enum: Object.keys(INVESTMENT_PLANS),
            },
            planName: {
                type: String,
                required: true,
            },
            dailyROIPercentage: {
                type: Number,
                required: true,
            },
            durationDays: {
                type: Number,
                required: true,
            },
        },

        startDate: {
            type: Date,
            default: Date.now,
        },

        // Auto-calculated in pre-save: startDate + durationDays
        endDate: {
            type: Date,
        },

        // Running total of ROI paid out against this investment
        totalROIPaid: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ['Active', 'Completed', 'Cancelled'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Fetch all investments for a specific user filtered by status
investmentSchema.index({ user: 1, status: 1 });
// Cron job queries all active investments that haven't ended yet
investmentSchema.index({ status: 1, endDate: 1 });

// ─── Pre-save Hook: Auto-calculate endDate ────────────────────────────────────
investmentSchema.pre('save', function () {
    if (this.isNew) {
        const start = new Date(this.startDate);
        start.setDate(start.getDate() + this.plan.durationDays);
        this.endDate = start;
    }
});

// ─── Static Method: Get plan config by planId ─────────────────────────────────
investmentSchema.statics.getPlan = function (planId) {
    return INVESTMENT_PLANS[planId] || null;
};

// ─── Static Method: Find which plan fits a given amount ───────────────────────
investmentSchema.statics.getPlanForAmount = function (amount) {
    const entry = Object.entries(INVESTMENT_PLANS).find(
        ([, plan]) => amount >= plan.minAmount && amount <= plan.maxAmount
    );
    return entry ? { planId: entry[0], ...entry[1] } : null;
};

module.exports = mongoose.model('Investment', investmentSchema);
module.exports.INVESTMENT_PLANS = INVESTMENT_PLANS;