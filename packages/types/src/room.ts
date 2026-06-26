import type { RoomRole } from "./auth.js";

export type RoomMemberInfo = {
  userId: number;
  name: string;
  roomRole: RoomRole;
};
