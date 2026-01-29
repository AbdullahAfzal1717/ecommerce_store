import api from './api'; // Your axios instance

export const userService = {
    updateProfile: async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        
        if (data.avatar instanceof File) {
            formData.append('avatar', data.avatar);
        }

        const response = await api.put('/auth/update-profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data;
    }
};