"use client";

import { useApp } from "@/lib/AppContext";

export function ProfilePage() {
  const { user, handleLogout } = useApp();

  if (!user) {
    return (
      <div className="px-8 py-12 text-center" style={{ color: "var(--muted)" }}>
        <h2 className="font-syne font-extrabold text-2xl mb-4" style={{ color: "var(--text)" }}>
          Profile unavailable
        </h2>
        <p>If you are not signed in, please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-12">
      <div className="max-w-3xl mx-auto rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}>
        <div className="mb-6">
          <div className="text-[0.78rem] font-medium uppercase tracking-[0.2em] mb-2" style={{ color: "var(--accent)" }}>
            Your Profile
          </div>
          <h1 className="font-syne font-extrabold text-3xl" style={{ color: "var(--text)" }}>
            {user.name}
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            {user.email}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}>
            <div className="text-[0.7rem] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--accent)" }}>
              Role
            </div>
            <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              {user.role === "employer" ? "Employer" : "Job Seeker"}
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}>
            <div className="text-[0.7rem] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--accent)" }}>
              Company
            </div>
            <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              {user.company ?? "Not provided"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>
            Account details
          </h2>
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}>
            <div className="mb-3">
              <div className="text-[0.72rem] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--muted)" }}>
                Name
              </div>
              <div style={{ color: "var(--text)" }}>{user.name}</div>
            </div>
            <div className="mb-3">
              <div className="text-[0.72rem] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--muted)" }}>
                Email
              </div>
              <div style={{ color: "var(--text)" }}>{user.email}</div>
            </div>
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--muted)" }}>
                Membership
              </div>
              <div style={{ color: "var(--text)" }}>
                {user.role === "employer" ? "Employer account" : "Job seeker account"}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-sm"
          style={{ background: "#F97316", color: "#fff" }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
