export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
