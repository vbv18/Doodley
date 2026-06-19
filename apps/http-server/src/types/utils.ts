import type { Request, Response, NextFunction } from "express"


export type AsyncRouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

