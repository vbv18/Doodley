import jwt from "jsonwebtoken";

import { env } from "@repo/config";
import type { JWTPayload } from "@repo/types";


export function verifyAccessToken(accessToken: string): JWTPayload {
    return jwt.verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET
    ) as JWTPayload;
}