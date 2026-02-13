import api from "./api";

export const settingsService = {
  // Fetch global configuration
  getGlobalSettings: async () => {
    try {
      const response = await api.get("/settings");
      return response.data; // Should return { success: true, data: { ... } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update global configuration
  updateGlobalSettings: async (settingsData) => {
    try {
      const response = await api.post("/settings", settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
