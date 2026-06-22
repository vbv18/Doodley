import type { Request, Response } from "express";

import AppError from "../../utils/AppError.js";
import { prisma } from "@repo/db";
import { enforceSessionCap, hashPassword, verifyPassword } from "./auth.utils.js";
import { hashToken, REFRESH_TOKEN_TTL_MS, signAccessToken, signRefreshToken } from "../../utils/token.js";
import { setRefreshCookie } from "../../utils/cookies.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import type { JWTPayload } from "@repo/types";


export async function register(req: Request, res: Response) {

    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(400, "Registeration Validation Failed!", parsed.error.format())
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (existing) {
        throw new AppError(409, "User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash
        },
        select: {
            id: true
        }
    });

    const payload: JWTPayload = {
        id: user.id,
        email
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.session.create({
        data: {
            userId: user.id,
            refreshTokenHash: hashToken(refreshToken),
            ip: req.ip ?? "unknown",
            userAgent: req.headers["user-agent"] ?? "unknown",
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        }
    });

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        accessToken
    });
}

export async function login(req: Request, res: Response) {

    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(400, "Login Validation Failed!", parsed.error.format());
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findFirst({
        where: {
            email
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!user || !(await verifyPassword(password, user.password))) {
        throw new AppError(401, "Invalid Credentials!");
    }

    const payload: JWTPayload = {
        id: user.id,
        email
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await enforceSessionCap(user.id.toString());

    await prisma.session.create({
        data: {
            userId: user.id,
            refreshTokenHash: hashToken(refreshToken),
            ip: req.ip ?? "unknown",
            userAgent: req.headers["user-agent"] ?? "unknown",
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        }
    });

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        accessToken
    });
}
