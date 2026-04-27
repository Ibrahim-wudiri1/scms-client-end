import axiosClient from "../api/axiosClient";

const checkout = async (priceId) => {
  const res = await axiosClient.post("/billing/checkout", { priceId });
  window.location.href = res.data.url;
};