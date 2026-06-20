import { RoomRole } from "@repo/types";


export const RoomPermissions = {
    EDIT_WHITEBOARD: ["OWNER", "ADMIN", "EDITOR"],
    SEND_CHAT_MESSAGES: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
    USE_AI: ["OWNER", "ADMIN", "EDITOR"],
    INVITE_MEMBERS: ["OWNER", "ADMIN", "EDITOR"],
    ACCEPT_NEW_MEMBERS: ["OWNER", "ADMIN"],
    REMOVE_MEMBERS: ["OWNER", "ADMIN"],
    CHANGE_MEMBER_ROLES: ["OWNER"],
    CHANGE_EDITOR_ROLE: ["OWNER", "ADMIN"],
    EXPORT_BOARD: ["OWNER", "ADMIN", "EDITOR"],
    MANAGE_SETTINGS: ["OWNER", "ADMIN"],
    DELETE_ROOM: ["OWNER"],
    VIEW_WHITEBOARD: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
} as const satisfies Record<string, readonly RoomRole[]>;

export type RoomPermission = keyof typeof RoomPermissions;
