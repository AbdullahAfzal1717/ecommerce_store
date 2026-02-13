import api from "./api";

export const orderService = {
  getAllOrders: async () => {
    const response = await api.get("/orders/all-orders");
    return response.data;
  },

  placeOrder: async (orderData, revalidate) => {
    const response = await api.post("/orders/place-order", orderData);
    if (response.data && typeof revalidate === "function") {
      await revalidate();
    }
    return response.data;
  },
  getMyOrders: () => api.get("/orders/my-orders"),

  updateStatus: async (orderId, status, revalidate) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    if (response.data && typeof revalidate === "function") {
      await revalidate();
    }
    return response.data;
  },
  getDashboardAnalytics: async () => {
    // Assuming you use axios or a custom fetch wrapper
    const response = await api.get("/orders/sales-stats");
    return response.data;
  },
  getUserAnalytics: async () => {
    // Assuming you use axios or a custom fetch wrapper
    const response = await api.get("/orders/user-stats");
    return response.data;
  },
  getReferralHistory: async () => {
    const response = await api.get("/orders/referrals"); // We will create this route next
    return response.data;
  },
};
