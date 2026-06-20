import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { RoomRole } from "@repo/types";
import { prisma } from "@repo/db";


export function requireRoomRole(roles: RoomRole[]) {

    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            throw new AppError(401, "Unauthorized");
        }

        const roomId: number = Number(req.params.roomId);

        if (Number.isNaN(roomId)) {
            throw new AppError(400, "Invalid room id");
        }

        const membership = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    roomId,
                    userId: req.user.id
                }
            }
        });

        if (!membership) {
            throw new AppError(403, "Not a room member");
        }

        if (!roles.includes(membership.role)) {
            throw new AppError(403, "Forbidden");
        }

        req.membership = membership;

        next();
    })
}