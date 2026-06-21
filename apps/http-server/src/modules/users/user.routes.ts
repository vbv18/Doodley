import { Router } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import * as userController from "./user.controller.js";


const userRouter: Router = Router();

// GET /api/v1/users/me
userRouter.get("/me", authenticate, asyncHandler(userController.getProfile));

// PATCH /api/v1/users/me
userRouter.patch("/me", authenticate, asyncHandler(userController.updateProfile));

// GET /api/v1/users/:id
userRouter.get("/:id", authenticate, asyncHandler(userController.getUserById));


export default userRouter;