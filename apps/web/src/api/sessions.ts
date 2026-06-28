import { api } from "./axios.js";

export async function refreshToken(): Promise<{ accessToken: string }> {
  const res = await api.post("/api/v1/sessions/refresh");
  return res.data;
}
