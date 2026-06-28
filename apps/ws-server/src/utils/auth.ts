import { env } from "../config/env.js";
import { verifyAccessToken as _verify } from "@repo/utils";

export const verifyAccessToken = (token: string) =>
  _verify(token, env.ACCESS_TOKEN_SECRET);
