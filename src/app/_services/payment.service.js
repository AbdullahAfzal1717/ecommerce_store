import api from "./api";

export const paymentService = {
  createIntent: async (amount) => {
    const response = await api.post("/payments/create-intent", { amount });
    return response;
  },
};
