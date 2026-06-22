


export type WsMessage =
    // | { type: "whiteboard:update"; elements: ExcalidrawElement[]; seqNo: number }
    | { type: "chat:message"; context: string; userId: number }
    | { type: "presence:cursor"; x: number; y: number; userId: number }
    | { type: "presence:join"; userId: number; name: string }
    | { type: "presence:leave"; userId: string }
    | { type: "ai:streaming"; chunk: string; requestId: number }
    | { type: "ai:done"; requestId: number }