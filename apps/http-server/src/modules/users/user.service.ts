import AppError from "../../utils/AppError.js";
import { prisma } from "@repo/db";
import { hashPassword } from "../auth/auth.utils.js";
import type { UpdateProfileRequestType } from "./user.validation.js";

export async function getProfile(userId: number) {
  const [user, ownedRooms, memberships] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        globalRole: true,
        avatar_url: true,
        createdAt: true,
      },
    }),

    prisma.room.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        name: true,
        roomCode: true,
        updatedAt: true,
      },
    }),

    prisma.roomMember.findMany({
      where: {
        userId,
      },
      select: {
        role: true,
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
            updatedAt: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { user, ownedRooms, memberships };
}

export async function updateProfile(
  userId: number,
  newUpdates: UpdateProfileRequestType,
) {
  const data: Record<string, unknown> = {};

  if (newUpdates.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: newUpdates.email,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(409, "Email already exists");
    }

    data.email = newUpdates.email;
  }

  if (newUpdates.name) {
    data.name = newUpdates.name;
  }

  if (newUpdates.avatar_url) {
    data.avatar_url = newUpdates.avatar_url;
  }

  if (newUpdates.password) {
    data.password = await hashPassword(newUpdates.password);
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      globalRole: true,
      avatar_url: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}
