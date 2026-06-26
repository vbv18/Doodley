import { Router } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import * as authController from "./auth.controller.js";

const authRouter: Router = Router();

// POST /api/v1/auth/register
authRouter.post("/register", asyncHandler(authController.register));

// POST /api/v1/auth/login
authRouter.post("/login", asyncHandler(authController.login));

// // POST /api/v1/auth/verify-email
// authRouter.post("/verify-email");

// // POST /api/v1/auth/forgot-password
// authRouter.post("/forgot-password");

// // POST /api/v1/auth/reset-password
// authRouter.post("/reset-password");

export default authRouter;
