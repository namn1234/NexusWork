"use client";

import { useApp } from "@/lib/AppContext";
import { Page } from "@/types";

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Jobs", page: "jobs" },
  { label: "Companies", page: "companies" },
  { label: "Saved", page: "saved" },
];

export function Nav() {
  const { currentPage, setPage, savedJobs, openModal, isLoggedIn, handleLogout, user } = useApp();

  return (
    <nav
      className="sticky top-0 z-[200] flex items-center justify-between px-8 py-4"
      style={{
        background: "rgba(8,12,20,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => setPage("home")}
        className="font-syne font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] bg-clip-text text-transparent"
      >
        NexusWork
      </button>

      {/* Links */}
      <ul className="flex gap-6 list-none items-center">
        {NAV_LINKS.map(({ label, page }) => (
          <li key={page}>
            <button
              onClick={() => setPage(page)}
              className="text-xs font-medium uppercase tracking-widest transition-colors duration-200 flex items-center gap-1"
              style={{
                color: currentPage === page ? "var(--text)" : "var(--muted)",
              }}
            >
              {label}
              {page === "saved" && savedJobs.size > 0 && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex gap-2 items-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => setPage("profile")}
              className="text-xs font-medium px-4 py-2 rounded-lg border transition-all duration-200"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--glass-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--glass)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--glass-border)";
              }}
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-medium px-4 py-2 rounded-lg border transition-all duration-200"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--glass-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--glass)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--glass-border)";
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => openModal("signin")}
            className="text-xs font-medium px-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              background: "transparent",
              color: "var(--text)",
              border: "1px solid var(--glass-border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--glass)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--glass-border)";
            }}
          >
            Sign In
          </button>
        )}
        {isLoggedIn && user?.role === "employer" && (
          <button
            onClick={() => openModal("post")}
            className="text-xs font-semibold px-4 py-2 rounded-lg border-none transition-all duration-200"
            style={{ background: "var(--accent)", color: "#fff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Post a Job
          </button>
        )}
      </div>
    </nav>
  );
}
