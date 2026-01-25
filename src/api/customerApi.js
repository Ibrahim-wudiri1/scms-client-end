import axiosClient from "./axiosClient";

export const customerApi = {
  getAll: async () => {
    const res = await axiosClient.get("/customers");
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/customers", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/customers/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await axiosClient.delete(`/customers/${id}`);
    return res.data;
  },
};
