import { Router } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import * as sessionController from "./sessions.controller.js";

const sessionRouter: Router = Router();

// POST /api/v1/sessions/refresh
sessionRouter.post("/refresh", asyncHandler(sessionController.refreshToken));

// GET /api/v1/sessions
sessionRouter.get("/", asyncHandler(sessionController.active));

// DELETE /api/v1/sessions/current
sessionRouter.delete("/current", asyncHandler(sessionController.deleteCurrent));

// DELETE /api/v1/sessions/:id
sessionRouter.delete("/:id", asyncHandler(sessionController.deleteById));

// DELETE /api/v1/sessions/
sessionRouter.delete("/", asyncHandler(sessionController.deleteAll));

export default sessionRouter;
