import jwt from "jsonwebtoken";

import type { JWTPayload } from "@repo/types";

export function verifyAccessToken(token: string, secret: string): JWTPayload {
  return jwt.verify(token, secret) as JWTPayload;
}
