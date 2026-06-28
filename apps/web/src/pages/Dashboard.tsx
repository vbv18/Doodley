import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, Modal, RoomCard } from "@repo/ui";
import { PlusIcon } from "@repo/ui/icons";
import { useAuthStore } from "../store/auth.store.js";
import {
  useGetRooms,
  useCreateRoom,
  useDeleteRoom,
  useLeaveRoom,
  useAcceptInvite,
} from "../hooks/rooms.js";
import { createInvitation } from "../api/rooms.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = () => {
    useAuthStore((s) => s.logout);
    navigate("/login");
  };

  const { data, isLoading } = useGetRooms();
  const createRoom = useCreateRoom();
  const deleteRoom = useDeleteRoom();
  const leaveRoom = useLeaveRoom();
  const acceptInvite = useAcceptInvite();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState<number | null>(null);

  const memberships = data?.memberships ?? [];

  function handleCreateRoom() {
    if (!roomName.trim()) return;
    createRoom.mutate(roomName.trim(), {
      onSuccess: () => {
        setRoomName("");
        setShowCreateModal(false);
      },
    });
  }

  function handleJoinRoom() {
    if (!inviteToken.trim()) return;
    acceptInvite.mutate(inviteToken.trim(), {
      onSuccess: () => {
        setInviteToken("");
        setShowJoinModal(false);
      },
    });
  }

  async function handleShareRoom(e: React.MouseEvent, roomId: number) {
    e.stopPropagation();
    try {
      const { invitation } = await createInvitation(roomId);
      await navigator.clipboard.writeText(invitation.token);
      setCopiedRoomId(roomId);
      setTimeout(() => setCopiedRoomId(null), 2000);
    } catch {
      console.error("Failed to copy invite token");
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div
          className="flex justify-center items-center gap-2 hover:cursor-pointer"
          // onClick={() => should refresh i.e. api.get("/rooms")}
        >
          <img src="/favicon.svg" alt="error" className="h-6 w-6" />

          <h1 className="text-lg sm:text-xl font-bold text-primary-btn-bg">
            doodle.ai
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:block text-sm text-gray-500 max-w-[120px] truncate">
            {user?.name}
          </span>

          <Button variant="secondary" size="md" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Your Rooms</h2>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowJoinModal(true)}
            >
              Join
            </Button>

            <Button
              variant="primary"
              size="sm"
              startIcon={<PlusIcon size="sm" />}
              onClick={() => setShowCreateModal(true)}
            >
              <span className="hidden sm:inline">New Room</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-btn-bg border-t-transparent" />
          </div>
        ) : memberships.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🎨</div>

            <p className="text-lg font-medium text-gray-500">No rooms yet</p>

            <p className="text-sm mt-1">
              Create one or join via an invite token.
            </p>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowJoinModal(true)}
              >
                Join Room
              </Button>

              <Button
                variant="primary"
                size="md"
                startIcon={<PlusIcon size="sm" />}
                onClick={() => setShowCreateModal(true)}
              >
                New Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {memberships.map(({ room, role }) => (
              <RoomCard
                key={room.id}
                name={room.name}
                role={role}
                updatedAt={room.updatedAt}
                copied={copiedRoomId === room.id}
                canShare={role === "OWNER" || role === "ADMIN"}
                isOwner={role === "OWNER"}
                onClick={() => navigate(`/rooms/${room.id}`)}
                onShare={(e: React.MouseEvent) => handleShareRoom(e, room.id)}
                onDelete={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  deleteRoom.mutate(room.id);
                }}
                onLeave={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  leaveRoom.mutate(room.id);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <Modal
          title="Create Room"
          onClose={() => {
            setShowCreateModal(false);
            setRoomName("");
          }}
        >
          <Input
            label="Room name"
            placeholder="My Whiteboard"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateRoom();
            }}
            autoFocus
          />
          {createRoom.isError && (
            <p className="text-red-500 text-sm mt-2">
              {(createRoom.error as Error).message}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              variant="tertiary"
              size="md"
              onClick={() => {
                setShowCreateModal(false);
                setRoomName("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="md"
              onClick={handleCreateRoom}
              disabled={createRoom.isPending || !roomName.trim()}
              className="flex-1"
            >
              {createRoom.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </Modal>
      )}

      {showJoinModal && (
        <Modal
          title="Join Room"
          onClose={() => {
            setShowJoinModal(false);
            setInviteToken("");
          }}
        >
          <Input
            label="Invite token"
            placeholder="Paste invite token here"
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoinRoom();
            }}
            autoFocus
          />
          {acceptInvite.isError && (
            <p className="text-red-500 text-sm mt-2">
              {(acceptInvite.error as Error).message}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              variant="tertiary"
              size="md"
              onClick={() => {
                setShowJoinModal(false);
                setInviteToken("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              size="md"
              onClick={handleJoinRoom}
              disabled={acceptInvite.isPending || !inviteToken.trim()}
              className="flex-1"
            >
              {acceptInvite.isPending ? "Joining..." : "Join"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
