"use client";

import { useApp } from "@/lib/AppContext";

export function Toast() {
  const { toast } = useApp();

  return (
    <div
      className="fixed bottom-6 right-6 z-[600] flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-350"
      style={{
        background: "#0d1321",
        border: "1px solid rgba(52,211,153,0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        transform: toast ? "translateY(0)" : "translateY(80px)",
        opacity: toast ? 1 : 0,
        pointerEvents: toast ? "auto" : "none",
      }}
      role="status"
      aria-live="polite"
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "var(--accent3)" }}
      />
      <span style={{ color: "var(--text)" }}>{toast}</span>
    </div>
  );
}
