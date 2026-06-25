const express = require('express');
const referralController = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── GET /api/referral/direct ─────────────────────────────────────────────────
router.get(
    '/direct',
    protect,
    referralController.getDirectReferrals
);

// ─── GET /api/referral/tree ───────────────────────────────────────────────────
router.get(
    '/tree',
    protect,
    referralController.getReferralTree
);

module.exports = router;