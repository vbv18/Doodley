import type { Request, Response } from "express";

import AppError from "../../utils/AppError.js";
import {
  AcceptInviteSchema,
  ChangeRoleSchema,
  CreateRoomSchema,
} from "./room.validation.js";
import * as roomService from "./room.service.js";
import type { RoomRole } from "@repo/types";

export async function getRooms(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const userId = req.user.id;

  const memberships = await roomService.getRooms(userId);

  return res.status(200).json({
    success: true,
    message: "Rooms fetched successfully",

    memberships,
  });
}

export async function createRoom(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const parsed = CreateRoomSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, "Invalid input");
  }

  const userId = req.user.id;
  const { roomName } = parsed.data;

  const room = await roomService.createRoom(userId, roomName);

  return res.status(201).json({
    success: true,
    message: "Room created",

    room,
  });
}

export async function getRoomById(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const roomId = Number(req.params.roomId);

  if (!Number.isInteger(roomId)) {
    throw new AppError(400, "Invalid room id");
  }

  const room = await roomService.getRoomById(roomId);

  return res.status(200).json({
    success: true,
    message: "Room fetched successfully",

    room,
  });
}

export async function getMembers(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const roomId = Number(req.params.roomId);

  if (!Number.isInteger(roomId)) {
    throw new AppError(400, "Invalid room id");
  }

  const members = await roomService.getMembers(roomId);

  return res.status(200).json({
    success: true,
    message: "All members fetched",

    members,
  });
}

export async function createInvitation(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const userId = req.user.id;
  const roomId = Number(req.params.roomId);

  if (!Number.isInteger(roomId)) {
    throw new AppError(400, "Invalid room id");
  }

  const invitation = await roomService.createInvitation(userId, roomId);

  return res.status(201).json({
    success: true,
    message: "Invitation created",

    invitation,
  });
}

export async function acceptInvite(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const userId = req.user.id;

  const parsed = AcceptInviteSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, "Invalid input");
  }

  const { token } = parsed.data;

  const membership = await roomService.acceptInvite(userId, token);

  return res.status(201).json({
    success: true,
    message: "Joined room",

    membership,
  });
}

export async function changeRoomRole(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  if (!req.membership) {
    throw new AppError(403, "Membership not found");
  }

  const parsed = ChangeRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, "Invalid input");
  }

  const requesterMembership = req.membership;
  const roomId = Number(req.params.roomId);
  const targetUserId = Number(req.params.userId);
  const role: RoomRole = parsed.data.role;

  if (!Number.isInteger(roomId)) {
    throw new AppError(400, "Invalid room id");
  }

  if (!Number.isInteger(targetUserId)) {
    throw new AppError(400, "Invalid user id");
  }

  await roomService.changeRoomRole(
    roomId,
    targetUserId,
    requesterMembership,
    role,
  );

  return res.status(200).json({
    success: true,
    message: "Role updated successfully",
  });
}

export async function removeMember(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  if (!req.membership) {
    throw new AppError(403, "Membership not found");
  }

  const roomId = Number(req.params.roomId);
  const targetUserId = Number(req.params.userId);

  if (!Number.isInteger(roomId)) {
    throw new AppError(400, "Invalid room id");
  }

  if (!Number.isInteger(targetUserId)) {
    throw new AppError(400, "Invalid user id");
  }

  const requesterMembership = req.membership;

  await roomService.removeMember(roomId, targetUserId, requesterMembership);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
}
