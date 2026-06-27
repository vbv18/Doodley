import type { GlobalRole, RoomRole } from "./auth.js";

export type User = {
  id: number;
  name: string;
  email: string;
  globalRole: GlobalRole;
  avatar_url: string | null;
};
