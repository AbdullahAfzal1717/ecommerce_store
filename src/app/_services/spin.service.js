import api from "./api";

export const spinService = {
  // Execute the spin on the backend
  executeSpin: async () => {
    try {
      const response = await api.post("/spins/execute");
      return response.data; // { success: true, data: { prize, amountWon, ... } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
