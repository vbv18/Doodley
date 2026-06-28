import type { AuthenticatedWs } from "../types/client.js";
import type { ServerMessage } from "@repo/types";

export function send(ws: AuthenticatedWs, message: ServerMessage): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

export function sendError(ws: AuthenticatedWs, message: string): void {
  send(ws, { type: "error", message });
}
