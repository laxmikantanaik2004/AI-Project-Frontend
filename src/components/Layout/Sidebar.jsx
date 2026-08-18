import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Bot,
  History,
  BrainCircuit,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/ai-mentor", label: "AI Mentor", icon: Bot },
  { to: "/ai-history", label: "AI History", icon: History },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="modal-overlay"
          onClick={onCloseMobile}
          style={{ zIndex: 40 }}
          aria-hidden="true"
        />
      )}

      <aside
        className="app-sidebar"
        data-open={mobileOpen}
        aria-label="Primary navigation"
      >
        <div className="sidebar-brand">
          <BrainCircuit size={22} className="sidebar-brand-icon" />
          <span className="sidebar-brand-text">AI Project Mentor</span>
          {mobileOpen && (
            <button
              type="button"
              className="btn-ghost btn-sm sidebar-close"
              onClick={onCloseMobile}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link-active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="text-xs">Frontend demo</p>
          <p className="text-xs">Mock data mode</p>
        </div>
      </aside>
    </>
  );
}
