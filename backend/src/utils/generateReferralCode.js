const crypto = require('crypto');

const generateReferralCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = crypto.randomBytes(length);

    return Array.from(bytes)
        .map((byte) => chars[byte % chars.length])
        .join('');
};

module.exports = generateReferralCode;