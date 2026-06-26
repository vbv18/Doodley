import { z } from "zod";

export const CreateRoomSchema = z.object({
  roomName: z.string().trim().min(3).max(24),
});

export const AcceptInviteSchema = z.object({
  token: z.string().min(1),
});

export const ChangeRoleSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
