import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@repo/ui";
import { LeftArrow, Send } from "@repo/ui/icons";
import { useAuthStore } from "../store/auth.store.js";
import { useWebSocket } from "../hooks/ws.js";
import { getRoomById, getChatHistory } from "../api/rooms.js";
import type { ServerMessage, ClientMessage } from "@repo/types";

type PresenceMember = { userId: number; name: string };
type ChatLine = {
  id: string;
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
};

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

function avatarColor(userId: number) {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const id = Number(roomId);

  const { data: roomData } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const { data: historyData } = useQuery({
    queryKey: ["chats", id],
    queryFn: () => getChatHistory(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [chatLines, setChatLines] = useState<ChatLine[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [mobileTab, setMobileTab] = useState<"canvas" | "chat">("canvas");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!historyData?.chats) return;
    setChatLines(
      historyData.chats.map((c) => ({
        id: String(c.id),
        userId: c.user.id,
        userName: c.user.name,
        text: c.message,
        createdAt: c.createdAt,
      })),
    );
  }, [historyData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLines]);

  function handleMessage(msg: ServerMessage) {
    switch (msg.type) {
      case "room:state":
        setMembers(msg.members);
        break;

      case "presence:join":
        setMembers((prev) => {
          if (prev.find((m) => m.userId === msg.userId)) return prev;
          return [...prev, { userId: msg.userId, name: msg.name }];
        });
        break;

      case "presence:leave":
        setMembers((prev) => prev.filter((m) => m.userId !== msg.userId));
        break;

      case "chat:message":
        setChatLines((prev) => [
          ...prev,
          {
            id: `${msg.userId}-${msg.createdAt}`,
            userId: msg.userId,
            userName: msg.userName,
            text: msg.context,
            createdAt: msg.createdAt,
          },
        ]);
        break;

      case "error":
        console.error("[ws] server error:", msg.message);
        break;
    }
  }

  const { send } = useWebSocket({ roomId: id, onMessage: handleMessage });

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const msg: ClientMessage = {
      type: "chat:message",
      roomId: id,
      message: text,
    };
    send(msg);
    setChatInput("");
    chatInputRef.current?.focus();
  }

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <p className="text-gray-500 mb-3">Invalid room.</p>
          <Button size="sm" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-primary-bg overflow-hidden">
      <header className="bg-white border-b px-3 sm:px-5 py-2.5 flex items-center justify-between flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
          >
            <LeftArrow size="sm" />
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {roomData?.room.name ?? "Loading..."}
              </span>

              {roomData?.room.roomCode && (
                <span className="hidden sm:inline-block text-xs bg-secondary-btn-bg text-secondary-btn-txt px-2 py-0.5 rounded font-mono flex-shrink-0">
                  {roomData.room.roomCode}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex -space-x-1.5">
            {members.slice(0, 5).map((m) => (
              <div
                key={m.userId}
                title={m.name}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-white text-xs flex items-center justify-center font-semibold ring-2 ring-white flex-shrink-0 ${avatarColor(m.userId)}`}
              >
                {m.name[0]?.toUpperCase()}
              </div>
            ))}

            {members.length > 5 && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center ring-2 ring-white font-medium">
                +{members.length - 5}
              </div>
            )}
          </div>

          <div className="flex lg:hidden bg-tertiary-btn-bg rounded-lg p-0.5">
            <button
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mobileTab === "canvas" ? "bg-white shadow-sm text-primary-btn-bg" : "text-gray-500"}`}
              onClick={() => setMobileTab("canvas")}
            >
              Board
            </button>

            <button
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mobileTab === "chat" ? "bg-white shadow-sm text-primary-btn-bg" : "text-gray-500"}`}
              onClick={() => setMobileTab("chat")}
            >
              Chat
              {chatLines.length > 0 && (
                <span className="ml-1 bg-primary-btn-bg text-white text-[10px] rounded-full px-1">
                  {chatLines.length > 99 ? "99+" : chatLines.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Whiteboard canvas */}
        <div
          className={`
            flex-1 flex flex-col bg-white border-r overflow-hidden
            ${mobileTab === "chat" ? "hidden sm:flex" : "flex"}
          `}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-20">🎨</div>
              <p className="text-gray-300 text-sm select-none">
                Whiteboard canvas — coming soon
              </p>
            </div>
          </div>
        </div>

        <div
          className={`
            flex flex-col bg-white
            w-full sm:w-72 lg:w-80
            border-l
            ${mobileTab === "canvas" ? "hidden lg:flex" : "flex"}
          `}
        >
          <div className="px-4 py-2.5 border-b flex items-center justify-between flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-700">Chat</h3>
            <span className="text-xs text-gray-400">
              {members.length} online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-2">
            {chatLines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <p className="text-gray-300 text-sm">No messages yet.</p>
                <p className="text-gray-300 text-xs mt-1">Say hello 👋</p>
              </div>
            ) : (
              chatLines.map((line) => {
                const isMe = line.userId === user?.id;
                return (
                  <div
                    key={line.id}
                    className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}
                  >
                    {!isMe && (
                      <span className="text-[11px] text-gray-400 px-1">
                        {line.userName}
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[200px] px-3 py-2 rounded-2xl text-sm break-words leading-relaxed ${
                        isMe
                          ? "bg-primary-btn-bg text-white rounded-br-sm"
                          : "bg-tertiary-btn-bg text-tertiary-btn-txt rounded-bl-sm"
                      }`}
                    >
                      {line.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-3 py-3 border-t flex gap-2 flex-shrink-0">
            <input
              ref={chatInputRef}
              className="flex-1 min-w-0 rounded-xl border px-3 py-2 text-sm outline-none focus:border-primary-btn-bg focus:ring-2 focus:ring-primary-btn-bg/20 transition-all bg-gray-50 focus:bg-white"
              placeholder="Message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChat();
                }
              }}
            />

            <Button
              variant="primary"
              size="sm"
              onClick={sendChat}
              disabled={!chatInput.trim()}
              // className="items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 active:scale-95 transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send size="md" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
