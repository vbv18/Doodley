import type { GlobalRole, RoomRole } from "@repo/types";


export type JWTPayload = {
    id: number,
    email: string
}

export type requireGlobalRoleType = {
    roles: GlobalRole[]
}

export type requireRoomRoleType = {
    roles: RoomRole[]
}