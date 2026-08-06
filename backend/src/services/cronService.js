const cron = require('node-cron');
const env = require('../config/env');
const { processDailyROI } = require('./roiService');

/**
 * Initialize and start the cron job.
 * Called once when the server starts.
 */
const startCronJobs = () => {
    console.log('Initializing cron jobs...');


    cron.schedule(env.CRON_SCHEDULE, async () => {
        console.log(`[CRON] Daily ROI job triggered at ${new Date().toISOString()}`);

        try {
            const results = await processDailyROI();

            console.log('[CRON] Daily ROI job completed successfully:', {
                processed: results.processed,
                skipped: results.skipped,
                failed: results.failed,
                totalROIDistributed: `₹${results.totalROIDistributed}`,
                completedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('[CRON] Daily ROI job failed:', error.message);
        }
    }, {
        // Run in Indian Standard Time (UTC+5:30)
        timezone: 'Asia/Kolkata',
        scheduled: true,
        recoverMissedExecutions: true,
    });

    console.log(`Cron job scheduled: ${env.CRON_SCHEDULE} (Asia/Kolkata)`);
};

/**
 * Manually trigger ROI processing — useful for testing without waiting for midnight.
 * Can be called from a test route or admin endpoint.
 */
const triggerManualROI = async () => {
    console.log('[MANUAL] Triggering ROI processing manually...');
    try {
        const results = await processDailyROI();
        console.log('[MANUAL] ROI processing completed:', results);
        return results;
    } catch (error) {
        console.error('[MANUAL] ROI processing failed:', error.message);
        throw error;
    }
};

module.exports = { startCronJobs, triggerManualROI };