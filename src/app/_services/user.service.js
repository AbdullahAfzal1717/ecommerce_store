import api from "./api"; // Your axios instance

export const userService = {
  updateProfile: async (data, revalidate) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    const response = await api.put("/auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data && typeof revalidate === "function") {
      await revalidate();
    }

    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
  getMyReferralTree: async () => {
    const response = await api.get("/auth/referral-tree");
    return response.data; // returns { success: true, data: { name, children... } }
  },

  // --- Admin Functions ---
  getAllUsers: async () => {
    const response = await api.get("/auth/all-users");
    console.log(response);
    return response.data; // returns { success: true, data: [user1, user2...] }
  },

  getUserTreeForAdmin: async (userId) => {
    const response = await api.get(`/auth/tree/${userId}`);
    return response.data; // returns tree data for the specific userId
  },
};
