import jwt from "jsonwebtoken";
import crypto from "crypto";
import ms, { type StringValue } from "ms";

import { httpEnv } from "@repo/config/http-env";
import { JWTPayload } from "../types/auth.js";


export const REFRESH_TOKEN_TTL_MS = ms(httpEnv.REFRESH_TOKEN_TTL as StringValue);

export function signAccessToken(payload: JWTPayload): string {
    return jwt.sign(
        payload,
        httpEnv.ACCESS_TOKEN_SECRET,
        {
            expiresIn: (httpEnv.ACCESS_TOKEN_TTL as StringValue)
        }
    );
}

export function signRefreshToken(payload: JWTPayload): string {
    return jwt.sign(
        payload,
        httpEnv.REFRESH_TOKEN_SECRET,
        {
            expiresIn: (httpEnv.REFRESH_TOKEN_TTL as StringValue)
        }
    );
}

export function verifyRefreshToken(refreshToken: string): JWTPayload {
    return jwt.verify(
        refreshToken,
        httpEnv.REFRESH_TOKEN_SECRET
    ) as JWTPayload;
}

export function verifyAccessToken(accessToken: string): JWTPayload {
    return jwt.verify(
        accessToken,
        httpEnv.ACCESS_TOKEN_SECRET
    ) as JWTPayload;
}

export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}