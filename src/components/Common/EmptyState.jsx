import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message, action }) {
  return (
    <div className="empty-state card">
      <Inbox size={36} className="text-muted" />
      <h3 className="mt-2">{title}</h3>
      {message && <p className="text-sm text-muted mt-1">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
