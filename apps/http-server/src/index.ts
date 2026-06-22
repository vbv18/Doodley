import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { httpEnv } from "@repo/config/http-env";
import authRouter from "./modules/auth/auth.routes.js";
import sessionRouter from "./modules/sessions/sessions.routes.js";
import userRouter from "./modules/users/user.routes.js";
import roomRouter from "./modules/rooms/room.routes.js";
import healthRouter from "./modules/health/health.routes.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sessions", sessionRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/health", healthRouter);


app.use(notFoundHandler);
app.use(errorHandler);


const port = httpEnv.HTTP_PORT;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});