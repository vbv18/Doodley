import { Router } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { requirePermission } from "../../middlewares/roomRole.middleware.js";
import { requireGlobalRole } from "../../middlewares/globalRole.middleware.js";
import * as roomController from "./room.controller.js";

const roomRouter: Router = Router();

// GET /api/v1/rooms/
roomRouter.get(
  "/",
  authenticate,
  requireGlobalRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  asyncHandler(roomController.getRooms),
);

// POST /api/v1/rooms/
roomRouter.post(
  "/",
  authenticate,
  requireGlobalRole(["USER", "ADMIN", "SUPER_ADMIN"]),
  asyncHandler(roomController.createRoom),
);

// GET /api/v1/rooms/:roomId
roomRouter.get(
  "/:roomId",
  authenticate,
  requirePermission("VIEW_WHITEBOARD"),
  asyncHandler(roomController.getRoomById),
);

// DELETE /api/v1/rooms/:roomId
roomRouter.delete(
  "/:roomId",
  authenticate,
  requirePermission("DELETE_ROOM"),
  asyncHandler(roomController.deleteRoom),
);

// DELETE /api/v1/rooms/:roomId/leave
roomRouter.delete(
  "/:roomId/leave",
  authenticate,
  asyncHandler(roomController.leaveRoom),
);

// GET /api/v1/rooms/:roomId/members
roomRouter.get(
  "/:roomId/members",
  authenticate,
  requirePermission("VIEW_WHITEBOARD"),
  asyncHandler(roomController.getMembers),
);

// POST /api/v1/rooms/:roomId/invitations
roomRouter.post(
  "/:roomId/invitations",
  authenticate,
  requirePermission("INVITE_MEMBERS"),
  asyncHandler(roomController.createInvitation),
);

// POST /api/v1/rooms/invitations/accept
roomRouter.post(
  "/invitations/accept",
  authenticate,
  asyncHandler(roomController.acceptInvite),
);

// PATCH /api/v1/rooms/:roomId/members/:userId
roomRouter.patch(
  "/:roomId/members/:userId",
  authenticate,
  requirePermission("MANAGE_MEMBER_ROLES"),
  asyncHandler(roomController.changeRoomRole),
);

// DELETE /api/v1/rooms/:roomId/members/:userId
roomRouter.delete(
  "/:roomId/members/:userId",
  authenticate,
  requirePermission("REMOVE_MEMBERS"),
  asyncHandler(roomController.removeMember),
);

// GET /api/v1/rooms/:roomId/chats
roomRouter.get(
  "/:roomId/chats",
  authenticate,
  requirePermission("VIEW_WHITEBOARD"),
  asyncHandler(roomController.getChatHistory),
);

// GET /api/v1/rooms/:roomId/whiteboard/history
roomRouter.get(
  "/:roomId/whiteboard/history",
  authenticate,
  requirePermission("VIEW_WHITEBOARD"),
  asyncHandler(roomController.getWhiteboardHistory),
);

export default roomRouter;
