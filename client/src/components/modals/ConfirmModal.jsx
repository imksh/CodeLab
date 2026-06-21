import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  type = "info", // "info" | "warn" | "danger" | "success"
  confirmText = "Confirm",
  cancelText = "Cancel",
  actions = [], // Fallback for previous usage if needed
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    info: {
      icon: <Info size={24} className="text-blue-500" />,
      bg: "bg-blue-500/10",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    warn: {
      icon: <AlertTriangle size={24} className="text-yellow-500" />,
      bg: "bg-yellow-500/10",
      btn: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    danger: {
      icon: <AlertCircle size={24} className="text-red-500" />,
      bg: "bg-red-500/10",
      btn: "bg-red-600 hover:bg-red-700 text-white",
    },
    success: {
      icon: <CheckCircle size={24} className="text-emerald-500" />,
      bg: "bg-emerald-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  };

  const currentType = typeConfig[type] || typeConfig.info;

  // Use actions if provided, otherwise build default from onConfirm/onClose
  const renderActions = () => {
    if (actions && actions.length > 0) {
      return actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            action.onClick?.();
            if (action.closeOnClick !== false) {
              onClose?.();
            }
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${action.className || "bg-gray-600 hover:bg-gray-500 text-white"}`}
        >
          {action.label}
        </button>
      ));
    }

    return (
      <>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-content/10 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${currentType.btn}`}
        >
          {confirmText}
        </button>
      </>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md rounded-xl border border-base-300/30 bg-base-100 shadow-2xl overflow-hidden scale-100 transition-transform duration-200"
      >
        <div className="p-6">
          <div className="flex gap-4">
            {/* Icon */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${currentType.bg}`}>
              {currentType.icon}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-base-content">{title}</h3>
              <p className="text-base-content/80 text-[15px] leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-base-200/50 border-t border-base-300/30 flex justify-end gap-3">
          {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;