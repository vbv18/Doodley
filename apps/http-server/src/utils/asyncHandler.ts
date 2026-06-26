import type { Request, Response, NextFunction } from "express";

import { AsyncRouteHandler } from "../types/utils.js";

export default function asyncHandler(func: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}
