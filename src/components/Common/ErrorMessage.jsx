import { AlertTriangle, X } from "lucide-react";

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="alert alert-error" role="alert">
      <AlertTriangle size={16} />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="btn-ghost btn-sm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
