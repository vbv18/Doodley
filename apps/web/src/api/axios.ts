import axios from "axios";

import { env } from "../config/env.js";
import { useAuthStore } from "../store/auth.store.js";

export const api = axios.create({
  baseURL: env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
