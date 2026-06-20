

import { GlobalRole } from "@repo/types";


export type JWTPayload = {
    id: number,
    email: string
}

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    globalRole: GlobalRole;
}