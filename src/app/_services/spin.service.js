import api from "./api";

export const spinService = {
  // Execute the spin on the backend
  executeSpin: async (revalidate) => {
    try {
      const response = await api.post("/spins/execute");
      if (response.data.success && typeof revalidate === "function") {
        await revalidate();
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
