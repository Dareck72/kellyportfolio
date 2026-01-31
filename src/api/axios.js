// api/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://dkhportfolio.pythonanywhere.com/api",
});

// Ajouter le token access automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
