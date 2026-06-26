import AppError from "../../utils/AppError.js";
import { prisma } from "@repo/db";
import { generateInviteToken, generateUniqueRoomCode, ROOM_ROLE_RANK } from "./room.utils.js";
import { MembershipContext } from "./room.types.js";
import { INVITATION_TTL_MS } from "@repo/config";
import type { RoomRole } from "@repo/types";


export async function getRooms(userId: number) {

    const memberships = await prisma.roomMember.findMany({
        where: {
            userId,
        },
        select: {
            role: true,
            room: {
                select: {
                    id: true,
                    name: true,
                    updatedAt: true
                }
            }
        }
    });

    return memberships;
}

export async function createRoom(userId: number, roomName: string) {

    const roomCode = await generateUniqueRoomCode();

    const isRoomNameUsed = await prisma.room.findUnique({
        where: {
            ownerId_name: {
                ownerId: userId,
                name: roomName
            }
        }
    });

    if (isRoomNameUsed) {
        throw new AppError(409, "Room name already used");
    }

    const room = await prisma.$transaction(async (tx) => {

        const room = await tx.room.create({
            data: {
                ownerId: userId,
                name: roomName,
                roomCode
            }
        });

        await tx.roomMember.create({
            data: {
                roomId: room.id,
                userId,
                role: "OWNER"
            }
        });

        return room;
    });

    return room;
}

export async function getRoomById(roomId: number) {

    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        },
        select: {
            id: true,
            name: true,
            roomCode: true,
            updatedAt: true,

            owner: {
                select: {
                    id: true,
                    name: true,
                    avatar_url: true
                }
            },

            _count: {
                select: {
                    chats: true,
                    aimessages: true,
                    whiteboardVersions: true
                }
            }
        }
    });

    if (!room) {
        throw new AppError(404, "Room not found");
    }

    return room;
}

export async function getMembers(roomId: number) {

    const members = await prisma.roomMember.findMany({
        where: {
            roomId
        },
        select: {
            role: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar_url: true
                }
            }
        }
    });

    return members;
}

export async function createInvitation(invitedById: number, roomId: number) {

    const token = generateInviteToken();

    const existingInvitation = await prisma.invitation.findFirst({
        where: {
            roomId,
            used: false
        }
    });

    if (existingInvitation) {
        return existingInvitation;
    }

    const invitation = await prisma.invitation.create({
        data: {
            roomId,
            invitedById,
            token,
            expiresAt: new Date(Date.now() + INVITATION_TTL_MS)
        }
    });

    return invitation;
}

export async function acceptInvite(userId: number, token: string) {

    const invitation = await prisma.invitation.findUnique({
        where: {
            token
        },
        select: {
            id: true,
            used: true,
            expiresAt: true,
            roomId: true
        }
    });

    if (!invitation) {
        throw new AppError(404, "Invitation not found");
    }

    if (invitation.used) {
        throw new AppError(400, "Invitation already used");
    }

    if (invitation.expiresAt < new Date()) {
        throw new AppError(400, "Invitation expired");
    }

    const existingMembership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId,
                roomId: invitation.roomId
            }
        }
    });

    if (existingMembership) {
        throw new AppError(409, "Already a member");
    }

    const membership = await prisma.$transaction(async (tx) => {

        await tx.invitation.update({
            where: {
                id: invitation.id,
                used: false
            },
            data: {
                used: true
            }
        });

        const membership = await tx.roomMember.create({
            data: {
                userId,
                roomId: invitation.roomId,
                role: "VIEWER"
            }
        });

        return membership;
    });

    return membership;
}

export async function changeRoomRole(roomId: number, targetUserId: number, requesterMembership: MembershipContext, newRole: RoomRole) {

    const targetMembership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: targetUserId,
                roomId
            }
        }
    });

    if (!targetMembership) {
        throw new AppError(404, "Member not found");
    }

    if (requesterMembership.userId === targetMembership.userId) {
        throw new AppError(400, "You cannot remove yourself from the room");
    }

    const requesterRank = ROOM_ROLE_RANK[requesterMembership.role];
    const targetRank = ROOM_ROLE_RANK[targetMembership.role];
    const newRoleRank = ROOM_ROLE_RANK[newRole];

    if (requesterRank <= targetRank || requesterRank <= newRoleRank) {
        throw new AppError(403, "Permission denied");
    }

    await prisma.roomMember.update({
        where: {
            userId_roomId: {
                userId: targetUserId,
                roomId
            }
        },
        data: {
            role: newRole
        }
    });

    return;
}

export async function removeMember(roomId: number, targetUserId: number, requesterMembership: MembershipContext) {

    const targetMembership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: targetUserId,
                roomId
            }
        }
    });

    if (!targetMembership) {
        throw new AppError(404, "Member not found");
    }

    if (requesterMembership.userId === targetMembership.userId) {
        throw new AppError(400, "You cannot remove yourself from the room");
    }

    const requesterRank = ROOM_ROLE_RANK[requesterMembership.role];

    const targetRank = ROOM_ROLE_RANK[targetMembership.role];

    if (requesterRank <= targetRank) {
        throw new AppError(403, "You do not have permission to remove this member");
    }

    await prisma.roomMember.delete({
        where: {
            userId_roomId: {
                userId: targetUserId,
                roomId
            }
        }
    });

    return;
}

