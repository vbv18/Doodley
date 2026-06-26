export type WsMessage =
  | { type: "whiteboard:update"; elements: unknown[]; snapshotId?: number }
  | { type: "chat:message"; context: string; userId: number }
  | { type: "presence:cursor"; x: number; y: number; userId: number }
  | { type: "presence:join"; userId: number; name: string }
  | { type: "presence:leave"; userId: number }
  | { type: "ai:streaming"; chunk: string; requestId: number }
  | { type: "ai:done"; requestId: number };

// Messages sent FROM client TO server
export type ClientMessage =
  | { type: "join-room"; roomId: number }
  | { type: "leave-room"; roomId: number }
  | { type: "whiteboard:update"; roomId: number; elements: unknown[] }
  | { type: "chat:message"; roomId: number; message: string }
  | { type: "presence:cursor"; roomId: number; x: number; y: number };

// Messages sent FROM server TO client
export type ServerMessage =
  | { type: "whiteboard:update"; elements: unknown[]; userId: number }
  | {
      type: "chat:message";
      context: string;
      userId: number;
      userName: string;
      createdAt: string;
    }
  | { type: "presence:cursor"; x: number; y: number; userId: number }
  | { type: "presence:join"; userId: number; name: string }
  | { type: "presence:leave"; userId: number }
  | {
      type: "room:state";
      whiteboardElements: unknown[];
      members: { userId: number; name: string }[];
    }
  | { type: "error"; message: string };
