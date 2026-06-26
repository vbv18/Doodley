import { api } from "./axios.js";

export async function register(name: string, email: string, password: string) {
  const response = await api.post("/api/v1/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  return response.data;
}
