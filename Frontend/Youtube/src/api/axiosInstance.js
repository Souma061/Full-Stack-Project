import axios from "axios";

// Get API base URL from environment variables, fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for sending cookies with requests
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token from localStorage or Redux store
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data directly for easier use in TanStack Query
    return response.data;
  },
  (error) => {
    // Handle token expiration and refresh
    if (error.response?.status === 401) {
      // Token expired - clear storage and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    // Create a custom error object with better info
    const customError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export default apiClient;
