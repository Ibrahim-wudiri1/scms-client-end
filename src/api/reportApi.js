import axiosClient from "./axiosClient";

export const reportApi = {
  summary: async () => {
    const res = await axiosClient.get("/reports/summary");
    return res.data;
  },
};
