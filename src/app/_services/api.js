import axios from 'axios';
import { getCookieValue } from "@jumbo/utilities/cookies";

const api = axios.create({
    baseURL: 'http://localhost:5050/api/v1',
});

api.interceptors.request.use((config) => {
    // Using your specific Jumbo utility
    try {
        const authData = getCookieValue("auth-user");
        if (authData && authData.token) {
            config.headers.Authorization = `Bearer ${authData.token}`;
        }
    } catch (error) {
        // If cookie is empty or invalid, we just proceed without token
        console.warn("Auth cookie not found or invalid");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;