import { CheckCircle, X } from "lucide-react";

export default function SuccessMessage({ message, onDismiss }) {
  return (
    <div className="alert alert-success" role="status">
      <CheckCircle size={16} />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="btn-ghost btn-sm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
