import type { AuthenticatedWs } from "./client.js";
import type { RoomRole } from "@repo/types";

export type RoomMember = {
  ws: AuthenticatedWs;
  userId: number;
  name: string;
  role: RoomRole;
};

export type RoomState = {
  roomId: number;
  members: Map<number, RoomMember>;
  whiteboardElements: unknown[];
};
