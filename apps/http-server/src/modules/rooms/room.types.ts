import type { RoomRole } from "@repo/types"


export type MembershipContext = {
    userId: number,
    roomId: number,
    role: RoomRole
};
