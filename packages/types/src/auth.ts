

export type JWTPayload = {
    id: number,
    email: string
}

export type GlobalRole = "SUPER_ADMIN" | "ADMIN" | "USER" | "GUEST";

export type RoomRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";