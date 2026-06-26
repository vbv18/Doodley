import jwt from "jsonwebtoken";
import crypto from "crypto";
import ms, { type StringValue } from "ms";

import { env } from "../config/env.js";
import { verifyAccessToken as _verify } from "@repo/utils";
import type { JWTPayload } from "@repo/types";

export const REFRESH_TOKEN_TTL_MS = ms(env.REFRESH_TOKEN_TTL as StringValue);

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as StringValue,
  });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL as StringValue,
  });
}

export const verifyAccessToken = (token: string) =>
  _verify(token, env.ACCESS_TOKEN_SECRET);

export function verifyRefreshToken(refreshToken: string): JWTPayload {
  return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JWTPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
