import axios from "axios";
import { getAccessToken } from "./authService";

const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor can be added here for handling token refresh logic

export default api;
