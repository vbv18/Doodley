import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "@repo/db";
import { verifyAccessToken } from "../utils/token.js";


export const authenticate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const authorization = req.headers.authorization?.split(" ");

        if (!authorization || authorization[0] !== "Bearer" || !authorization[1]) {
            throw new AppError(401, "Unauthorized");
        }

        const decoded = verifyAccessToken(authorization[1]);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                globalRole: true
            }
        });

        if (!user) {
            throw new AppError(401, "User not found");
        }

        req.user = user;

        next();
    }
);
