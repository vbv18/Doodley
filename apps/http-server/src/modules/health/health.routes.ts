import { Router } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import * as healthController from "./health.controller.js";

const healthRouter: Router = Router();

// GET /api/v1/health
healthRouter.get("/", asyncHandler(healthController.basic));

// GET /api/v1/health/db
healthRouter.get("/db", asyncHandler(healthController.database));

export default healthRouter;
