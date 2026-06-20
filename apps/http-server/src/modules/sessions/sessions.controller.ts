import type { Request, Response } from "express";

import AppError from "../../utils/AppError.js";
import { hashToken, REFRESH_TOKEN_TTL_MS, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/token.js";
import { JWTPayload } from "../../types/auth.js";
import { prisma } from "@repo/db";
import { clearRefreshCookie, setRefreshCookie } from "../../utils/cookies.js";


export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const session = await prisma.session.findFirst({
        where: {
            refreshTokenHash: hashToken(refreshToken),
            revoked: false
        }
    });

    if (!session) {

        await prisma.session.updateMany({
            where: {
                userId: decoded.id
            },
            data: {
                revoked: true
            }
        });

        clearRefreshCookie(res);

        throw new AppError(401, "Alert! Your account may be at risk.");
    }

    const payload: JWTPayload = {
        id: decoded.id,
        email: decoded.email
    }

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);


    await prisma.session.update({
        where: {
            id: session.id
        },
        data: {
            refreshTokenHash: hashToken(newRefreshToken),
            revoked: false,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        }
    });

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
        success: true,
        message: "Access Token refreshed successfully",
        accessToken: newAccessToken
    })
}

export async function active(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Unauthorized");
    }

    verifyRefreshToken(refreshToken);

    const session = await prisma.session.findFirst({
        where: {
            refreshTokenHash: hashToken(refreshToken),
            revoked: false
        }
    });

    if (!session) {
        throw new AppError(401, "Invalid session.");
    }

    const activeSessions = await prisma.session.findMany({
        where: {
            userId: session.userId,
            revoked: false
        }
    });

    return res.status(200).json({
        success: true,
        message: `${activeSessions.length} sessions are active.`,
        sessions: activeSessions.map(({ userAgent, updatedAt }) => ({ userAgent, updatedAt }))
    });
}

export async function deleteCurrent(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Unauthorized");
    }

    verifyRefreshToken(refreshToken);

    const session = await prisma.session.findFirst({
        where: {
            refreshTokenHash: hashToken(refreshToken),
            revoked: false
        }
    })

    if (!session) {
        throw new AppError(401, "No active session.");
    }

    await prisma.session.update({
        where: {
            id: session.id
        },
        data: {
            revoked: true
        }
    })

    clearRefreshCookie(res);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
}

export async function deleteById(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const sessionId = Number(req.params.id);

    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            userId: decoded.id,
            revoked: false
        }
    });

    if (!session) {
        throw new AppError(400, "Session already expired");
    }

    await prisma.session.update({
        where: {
            id: sessionId,
            userId: decoded.id
        },
        data: {
            revoked: true
        }
    });

    return res.status(200).json({
        success: true,
        message: "Session revoked successfully."
    });
}

export async function deleteAll(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const sessions = await prisma.session.updateMany({
        where: {
            userId: decoded.id,
            revoked: false
        },
        data: {
            revoked: true
        }
    });

    clearRefreshCookie(res);

    return res.status(200).json({
        success: true,
        message: "Logged out from all devices."
    });
} 