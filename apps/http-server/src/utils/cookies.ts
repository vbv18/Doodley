import express from "express";

import { env } from "../config/env.js";
import { REFRESH_TOKEN_TTL_MS } from "./token.js";

export function setRefreshCookie(res: express.Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
}

export function clearRefreshCookie(res: express.Response): void {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
}
