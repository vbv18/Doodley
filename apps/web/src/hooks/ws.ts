import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../store/auth.store.js";
import type { ClientMessage, ServerMessage } from "@repo/types";
import { env } from "../config/env.js";

const WS_URL = env.VITE_WS_URL;

type Options = {
  roomId: number;
  onMessage: (msg: ServerMessage) => void;
};

export function useWebSocket({ roomId, onMessage }: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken || !WS_URL) return;

    const ws = new WebSocket(`${WS_URL}?token=${accessToken}`);
    wsRef.current = ws;

    ws.onopen = () => {
      send({ type: "join-room", roomId });
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as ServerMessage;
        onMessageRef.current(msg);
      } catch {
        console.error("[ws] failed to parse message", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("[ws] error", err);
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave-room", roomId }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [accessToken, roomId]);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { send };
}
