import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";
import { GlobalRole } from "@repo/types";


export function requireGlobalRole(roles: GlobalRole[]) {

    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            throw new AppError(401, "Unauthorized");
        }

        if (!roles.includes(req.user.globalRole)) {
            throw new AppError(403, "Forbidden");
        }

        next();
    }
}