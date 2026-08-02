import api from './api';

export const investmentService = {
    create: async (data) => {
        const response = await api.post('/investments', data);
        return response.data;
    },

    getAll: async (status) => {
        const params = status ? { status } : {};
        const response = await api.get('/investments', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/investments/${id}`);
        return response.data;
    },
};