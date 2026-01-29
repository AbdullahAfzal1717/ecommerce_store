import api from './api';

export const categoryService = {
    // Fetch all categories for the table
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data; // This returns the array of categories
    },

    // Add this to your categoryService object
getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data; // This returns the single category object
},

    // Send new category data (including the image file)
    create: async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await api.post('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    // Add this inside your categoryService object
update: async (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    // Only append image if a new one was selected
    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await api.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
},

    // Delete a category by ID
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};