import api from './api';

export const referralService = {
    getDirectReferrals: async () => {
        const response = await api.get('/referral/direct');
        return response.data;
    },

    getReferralTree: async () => {
        const response = await api.get('/referral/tree');
        return response.data;
    },
};