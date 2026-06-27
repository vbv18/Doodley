import { DeleteIcon, ShareIcon } from "./icons";

type RoomCardProps = {
  name: string;
  role: string;
  updatedAt: string;
  copied: boolean;
  canShare: boolean;
  isOwner: boolean;
  onClick: () => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onLeave: (e: React.MouseEvent) => void;
};

export function RoomCard({
  name,
  role,
  updatedAt,
  copied,
  canShare,
  isOwner,
  onClick,
  onShare,
  onDelete,
  onLeave,
}: RoomCardProps) {
  const roleBadgeColor: Record<string, string> = {
    OWNER: "bg-primary-btn-bg/10 text-primary-btn-bg",
    ADMIN: "bg-blue-50 text-blue-600",
    EDITOR: "bg-green-50 text-green-600",
    VIEWER: "bg-gray-100 text-gray-500",
  };

  return (
    <div
      className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 truncate hover:text-primary-btn-bg transition-colors">
            {name}
          </h3>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${roleBadgeColor[role] ?? "bg-gray-100 text-gray-500"}`}
          >
            {role}
          </span>
        </div>

        <div
          className="flex gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {canShare && (
            <button
              className="p-1.5 rounded-md hover:bg-secondary-btn-bg text-gray-400 hover:text-primary-btn-bg transition-colors"
              title={copied ? "Copied!" : "Copy invite token"}
              onClick={onShare}
            >
              {copied ? (
                <span className="text-xs font-medium text-green-600">✓</span>
              ) : (
                <ShareIcon size="sm" />
              )}
            </button>
          )}
          <button
            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title={isOwner ? "Delete room" : "Leave room"}
            onClick={isOwner ? onDelete : onLeave}
          >
            <DeleteIcon size="sm" />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Updated {new Date(updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
