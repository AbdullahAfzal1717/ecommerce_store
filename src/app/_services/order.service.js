import api from "./api";

export const orderService = {
  getAllOrders: async () => {
    const response = await api.get("/orders/all-orders");
    return response.data;
  },

  placeOrder: async (orderData) => {
    const response = await api.post("/orders/place-order", orderData);
    return response.data;
  },
  getMyOrders: () => api.get("/orders/my-orders"),

  updateStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  getDashboardAnalytics: async () => {
    // Assuming you use axios or a custom fetch wrapper
    const response = await api.get("/orders/sales-stats");
    return response.data;
  },
};
