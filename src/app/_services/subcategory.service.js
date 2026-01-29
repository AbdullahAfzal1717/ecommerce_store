import api from './api';

export const subcategoryService = {
    getAll: async () => {
        const response = await api.get('/subcategories');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/subcategories/${id}`);
        return response.data;
    },

    // Lightweight fetch for the Parent Category dropdown
    getCategoryList: async () => {
        const response = await api.get('/categories/titles');
        return response.data;
    },

    create: async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('catId', data.categoryId); // Matches your service param name
        if (data.image) formData.append('image', data.image);

        const response = await api.post('/subcategories', formData);
        return response.data;
    },

    update: async (id, data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('catId', data.categoryId);
        if (data.image) formData.append('image', data.image);

        const response = await api.put(`/subcategories/${id}`, formData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/subcategories/${id}`);
        return response.data;
    }
};