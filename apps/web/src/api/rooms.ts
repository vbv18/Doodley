import { api } from "./axios.js";
import type { User } from "@repo/types";

export type Room = {
  id: number;
  name: string;
  updatedAt: string;
};

export type RoomMembership = {
  role: string;
  room: Room;
};

export type RoomDetail = {
  id: number;
  name: string;
  roomCode: string;
  updatedAt: string;
  owner: User;
  _count: {
    chats: number;
    aimessages: number;
    whiteboardVersions: number;
  };
};

export type RoomMember = {
  role: string;
  user: User;
};

export type Invitation = {
  id: number;
  token: string;
  expiresAt: string;
};

export type ChatMessage = {
  id: number;
  message: string;
  createdAt: string;
  user: User;
};

export async function getRooms(): Promise<{ memberships: RoomMembership[] }> {
  const res = await api.get("/api/v1/rooms");
  return res.data;
}

export async function createRoom(roomName: string): Promise<{ room: Room }> {
  const res = await api.post("/api/v1/rooms", { roomName });
  return res.data;
}

export async function getRoomById(
  roomId: number,
): Promise<{ room: RoomDetail }> {
  const res = await api.get(`/api/v1/rooms/${roomId}`);
  return res.data;
}

export async function deleteRoom(roomId: number): Promise<void> {
  await api.delete(`/api/v1/rooms/${roomId}`);
}

export async function leaveRoom(roomId: number): Promise<void> {
  await api.delete(`/api/v1/rooms/${roomId}/leave`);
}

export async function getMembers(
  roomId: number,
): Promise<{ members: RoomMember[] }> {
  const res = await api.get(`/api/v1/rooms/${roomId}/members`);
  return res.data;
}

export async function createInvitation(
  roomId: number,
): Promise<{ invitation: Invitation }> {
  const res = await api.post(`/api/v1/rooms/${roomId}/invitations`);
  return res.data;
}

export async function acceptInvite(token: string): Promise<void> {
  await api.post("/api/v1/rooms/invitations/accept", { token });
}

export async function getChatHistory(
  roomId: number,
  cursor?: number,
): Promise<{ chats: ChatMessage[]; nextCursor?: number }> {
  const res = await api.get(`/api/v1/rooms/${roomId}/chats`, {
    params: cursor ? { cursor } : {},
  });
  return res.data;
}
