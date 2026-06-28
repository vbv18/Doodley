import { create } from "zustand";
import type { RoomMembership } from "../api/rooms.js";

type RoomsStore = {
  memberships: RoomMembership[];
  setMemberships: (memberships: RoomMembership[]) => void;
  addMembership: (membership: RoomMembership) => void;
  removeMembership: (roomId: number) => void;
};

export const useRoomsStore = create<RoomsStore>((set) => ({
  memberships: [],

  setMemberships: (memberships) => set({ memberships }),

  addMembership: (membership) =>
    set((state) => ({ memberships: [...state.memberships, membership] })),

  removeMembership: (roomId) =>
    set((state) => ({
      memberships: state.memberships.filter((m) => m.room.id !== roomId),
    })),
}));
