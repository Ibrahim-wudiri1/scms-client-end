import axiosClient from "./axiosClient";

export const inventoryApi = {
    getAll: async () => {
        const res = await axiosClient.get("/products");
        return res.data;
    },

    create: async (data) => {
        const res = await axiosClient.post("/products", data);
        return res.data;
    },

    update: async (id) => {
        const res = await axiosClient.put(`/products/${id}`);
        return res.data;
    },

    remove: async (id) => {
        const res = await axiosClient.delete(`/products/${id}`);
        return res.data;
    },
};