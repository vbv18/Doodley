import type { Request, Response } from "express";

import AppError from "../../utils/AppError.js";
import { UpdateProfileRequestSchema } from "./user.validation.js";
import * as userService from "./user.service.js";


export async function getProfile(req: Request, res: Response) {

    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const userId: number = req.user.id;

    const { user, ownedRooms, memberships } = await userService.getProfile(userId);

    return res.status(200).json({
        success: true,
        message: "User Profile Fetched",

        user,
        ownedRooms,
        memberships
    });
}

export async function updateProfile(req: Request, res: Response) {

    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const parsed = UpdateProfileRequestSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(400, "Invalid inputs");
    }

    const userId = req.user.id;
    const newUpdates = parsed.data;

    await userService.updateProfile(userId, newUpdates);

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully"
    });
}

export async function getUserById(req: Request, res: Response) {

    const userId = Number(req.params.id);

    const user = await userService.getUserById(userId);

    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user
    });
}