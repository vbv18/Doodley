import { WebSocketServer } from "ws";

import { env } from "./config/env.js";
import { prisma, connectRedis, disconnectRedis } from "@repo/db";

import { authenticateWs } from "./middlewares/authenticate.middleware.js";
import { handleConnection } from "./handlers/connection.handler.js";
import { ConnectionManager } from "./managers/connection.manager.js";
import { RoomManager } from "./managers/room.manager.js";
import type { AuthenticatedWs } from "./types/client.js";

const connectionManager = new ConnectionManager();
const roomManager = new RoomManager();

const wss = new WebSocketServer({ port: env.WS_PORT });

wss.on("connection", async function connection(ws, req) {
  try {
    const url = new URL(req.url ?? "/", `ws://localhost`);
    const token = url.searchParams.get("token") ?? null;

    if (!token) {
      ws.close(1008, "Unauthorized");
      return;
    }

    const user = await authenticateWs(token);
    (ws as AuthenticatedWs).user = user;

    handleConnection(ws as AuthenticatedWs, connectionManager, roomManager);
  } catch (err) {
    console.error("[ws] connection error:", err);
    ws.close(1008, "Unauthorized");
  }
});

wss.on("error", (err) => {
  console.error("[ws] server error:", err);
});

async function start() {
  if (env.REDIS_URL) {
    try {
      await connectRedis();
      console.log("[ws] Redis connected");
    } catch (err) {
      console.warn(
        "[ws] Redis connection failed, continuing without Redis:",
        err,
      );
    }
  } else {
    console.log("[ws] REDIS_URL not set - running without cache.");
  }

  await prisma.$connect();
  console.log("Database connected");

  console.log(`WebSocket server listening on port ${env.WS_PORT}`);
}

start().catch((err) => {
  console.error("[ws] startup failed:", err);
  process.exit(1);
});

async function shutdown(signal: string) {
  console.log(`[ws] ${signal} received, shutting down...`);
  wss.close();
  await prisma.$disconnect();
  await disconnectRedis();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
