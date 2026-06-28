import { GlobalRole } from "@repo/types";
import { api } from "./axios.js";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  globalRole: GlobalRole;
  avatar_url: string | null;
  createdAt: string;
};

export async function getMe(): Promise<{ user: UserProfile }> {
  const res = await api.get("/api/v1/users/me");
  return res.data;
}
