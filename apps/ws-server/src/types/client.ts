import { WebSocket } from "ws";

import { GlobalRole, RoomRole } from "@repo/types";

export type WsUser = {
  id: number;
  name: string;
  globalRole: GlobalRole;
};

export interface AuthenticatedWs extends WebSocket {
  user: WsUser;
  roomId?: number;
  roomRole?: RoomRole;
}
