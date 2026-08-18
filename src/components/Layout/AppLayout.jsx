import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Overview of your projects and tasks" },
  "/projects": { title: "Projects", subtitle: "Create and manage your software projects" },
  "/tasks": { title: "Tasks", subtitle: "Track and update development tasks" },
  "/ai-mentor": { title: "AI Mentor", subtitle: "Get AI guidance for your project" },
  "/ai-history": { title: "AI History", subtitle: "Review previous AI interactions" },
};

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find matching meta entry (handle /projects/:id)
  const key = Object.keys(pageMeta).find((k) =>
    k === "/" ? location.pathname === "/" : location.pathname.startsWith(k)
  );
  const meta = pageMeta[key] || { title: "Page", subtitle: "" };

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="app-main">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
