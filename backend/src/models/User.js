const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generateReferralCode = require('../utils/generateReferralCode');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },

        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },

        referralCode: {
            type: String,
            unique: true,
        },
        
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        walletBalance: {
            type: Number,
            default: 0,
            min: [0, 'Wallet balance cannot be negative'],
        },

        totalROIEarned: {
            type: Number,
            default: 0,
        },

        totalLevelIncomeEarned: {
            type: Number,
            default: 0,
        },

        accountStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Suspended'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Fast lookup when building referral tree
userSchema.index({ referredBy: 1 });

/// ─── Pre-save Hook: Hash password + generate referral code ───────────────────
userSchema.pre('save', async function () {
    // Auto-generate referral code for new users
    if (this.isNew && !this.referralCode) {
        this.referralCode = generateReferralCode();
    }

    // Only hash if password was changed
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: Compare password on login ───────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Return safe user object without password ────────────────
userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        mobile: this.mobile,
        referralCode: this.referralCode,
        walletBalance: this.walletBalance,
        totalROIEarned: this.totalROIEarned,
        totalLevelIncomeEarned: this.totalLevelIncomeEarned,
        accountStatus: this.accountStatus,
        createdAt: this.createdAt,
    };
};

module.exports = mongoose.model('User', userSchema);