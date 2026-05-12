import axios from "axios";
import { queueRequest } from "../lib/offline/requestQueue";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Request interceptor - add token and handle offline mode
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const activeShop = localStorage.getItem("activeShop");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add shop context to config for offline handling
    if (activeShop) {
      try {
        const shopData = JSON.parse(activeShop);
        config.shopId = shopData.id;
        config.tenantId = shopData.tenantId;
      } catch (e) {
        // Skip if activeShop is not valid JSON
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401, offline errors, and queue management
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // Handle network errors (offline or no connection)
    if (!error.response || error.code === 'ERR_NETWORK' || !navigator.onLine) {
      const { config } = error;
      
      // Only queue POST, PUT, DELETE requests (not GET)
      if (config && ['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase())) {
        try {
          // Queue the request for later sync
          await queueRequest({
            method: config.method.toUpperCase(),
            url: config.url,
            data: config.data,
            headers: config.headers,
            params: config.params,
            shopId: config.shopId,
            tenantId: config.tenantId,
          });
          
          // Return a special response indicating the request was queued
          return Promise.resolve({
            status: 202, // Accepted (processing later)
            statusText: "Queued for sync",
            data: {
              queued: true,
              message: "Request queued - will sync when online",
              original: config,
            },
            config,
          });
        } catch (queueError) {
          console.error("Failed to queue request:", queueError);
          return Promise.reject(error);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
