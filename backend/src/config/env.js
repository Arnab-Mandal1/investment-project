const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/investmentdb',

    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_in_production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    MAX_REFERRAL_LEVELS: parseInt(process.env.MAX_REFERRAL_LEVELS || '5', 10),


    REFERRAL_PERCENTAGES: [10, 5, 3, 2, 1],


    CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 0 * * *',

    BREVO_USER: process.env.BREVO_USER || '',
    BREVO_PASS: process.env.BREVO_PASS || '',
};

if (env.NODE_ENV === 'production' && !env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
}
module.exports = env;