import { AuthUser } from "../modules/auth/auth.types.ts";
import { MembershipContext } from "../modules/rooms/room.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      membership?: MembershipContext;
    }
  }
}

export {};
