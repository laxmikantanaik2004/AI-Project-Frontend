import { statusOptions, priorityOptions } from "../../data/mockData";

export function StatusBadge({ status }) {
  const map = {
    Pending: "badge-warning",
    "In Progress": "badge-info",
    Completed: "badge-success",
  };
  return <span className={`badge ${map[status] || "badge-neutral"}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  const map = {
    Low: "badge-success",
    Medium: "badge-warning",
    High: "badge-danger",
  };
  return <span className={`badge ${map[priority] || "badge-neutral"}`}>{priority}</span>;
}

export function StatusSelect({ value, onChange, id }) {
  return (
    <select
      id={id}
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function PrioritySelect({ value, onChange, id, includeAll = false }) {
  return (
    <select
      id={id}
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {includeAll && <option value="">All Priorities</option>}
      {priorityOptions.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
