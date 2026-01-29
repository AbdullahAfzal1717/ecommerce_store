import api from "./api";

export const productService = {
  getAll: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Lightweight fetch for the Subcategory dropdown
  getSubCategoryList: async () => {
    // You'll need to add a /titles route for subcategories too,
    // similar to what we did for categories!
    const response = await api.get("/subcategories/titles");
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("subCategory", data.subCategory);

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await api.post("/products", formData);
    return response.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("subCategory", data.subCategory);

    if (data.existingImages) {
      data.existingImages.forEach((url) =>
        formData.append("existingImages", url)
      );
    }
    // Append new files
    if (data.images) {
      data.images.forEach((file) => formData.append("images", file));
    }

    const response = await api.put(`/products/${id}`, formData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
