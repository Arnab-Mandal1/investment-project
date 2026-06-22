const mongoose = require('mongoose');

const roiHistorySchema = new mongoose.Schema(
    {
        // The user whose wallet received this ROI
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },

        // The specific investment this ROI was generated from
        investment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investment',
            required: [true, 'Investment reference is required'],
        },

        // Calculated ROI amount credited to wallet
        // Formula: investment.amount * (dailyROIPercentage / 100)
        amount: {
            type: Number,
            required: [true, 'ROI amount is required'],
            min: [0, 'ROI amount cannot be negative'],
        },


        creditedDate: {
            type: Date,
            required: [true, 'Credited date is required'],
        },

        status: {
            type: String,
            enum: ['Credited', 'Pending', 'Failed'],
            default: 'Credited',
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Fetch ROI history for a user sorted by most recent first
roiHistorySchema.index({ user: 1, creditedDate: -1 });


roiHistorySchema.index(
    { investment: 1, creditedDate: 1 },
    { unique: true, name: 'unique_roi_per_investment_per_day' }
);

module.exports = mongoose.model('ROIHistory', roiHistorySchema);