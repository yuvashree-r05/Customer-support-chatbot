
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL?.replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach the JWT token to API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
