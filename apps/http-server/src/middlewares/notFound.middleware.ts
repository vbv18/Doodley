import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
}
