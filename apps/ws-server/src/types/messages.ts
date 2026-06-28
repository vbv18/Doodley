export enum WsEvent {
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",

  CURSOR = "presence:cursor",

  WHITEBOARD_UPDATE = "whiteboard:update",

  CHAT = "chat:message",

  USER_JOINED = "presence:join",
  USER_LEFT = "presence:leave",

  ROOM_STATE = "room:state",

  ERROR = "error",
}
