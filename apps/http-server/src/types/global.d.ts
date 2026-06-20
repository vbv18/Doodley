
import type { RoomMember } from "@repo/db";
import { GlobalRole, RoomRole } from "@repo/types";
import { AuthUser } from "./auth.ts";


declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
            membership?: RoomMember
        }
    }
}

export { }