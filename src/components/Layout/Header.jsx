import { Menu, Search, Bell, UserCircle } from "lucide-react";

export default function Header({ title, subtitle, onOpenMobile }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="btn-ghost btn-sm header-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={16} className="header-search-icon" />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
            className="header-search-input"
          />
        </div>
        <button
          type="button"
          className="btn-ghost btn-sm header-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="header-dot" />
        </button>
        <button
          type="button"
          className="btn-ghost btn-sm header-icon-btn"
          aria-label="Profile"
        >
          <UserCircle size={20} />
          <span className="header-profile-name">Student</span>
        </button>
      </div>
    </header>
  );
}
