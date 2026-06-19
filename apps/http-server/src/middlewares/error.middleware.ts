import type { Request, Response, NextFunction } from "express";
// import { Prisma } from "@prisma/client";

import AppError from "../utils/AppError.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    // Custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
    }

    // // Prisma known request errors
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //     switch (err.code) {
    //         case "P2002":
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "Resource already exists.",
    //             });

    //         case "P2025":
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Resource not found.",
    //             });

    //         default:
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Database operation failed.",
    //             });
    //     }
    // }

    // // Prisma validation errors
    // if (err instanceof Prisma.PrismaClientValidationError) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Invalid input data.",
    //     });
    // }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired.",
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
}