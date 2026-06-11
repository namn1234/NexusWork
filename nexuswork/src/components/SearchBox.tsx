"use client";

import { JobType } from "@/types";

interface SearchBoxProps {
  query: string;
  type: JobType;
  onQueryChange: (q: string) => void;
  onTypeChange: (t: JobType) => void;
  onSearch: () => void;
  placeholder?: string;
  showTypeSelect?: boolean;
  fullWidth?: boolean;
}

export function SearchBox({
  query,
  type,
  onQueryChange,
  onTypeChange,
  onSearch,
  placeholder = "Job title, skills or company...",
  showTypeSelect = true,
  fullWidth = false,
}: SearchBoxProps) {
  return (
    <div
      className="flex gap-1.5 p-1.5 rounded-2xl"
      style={{
        background: "rgba(13,19,33,0.95)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 0 60px rgba(79,142,247,0.12)",
        width: fullWidth ? "100%" : "min(620px, 90vw)",
        margin: fullWidth ? "0 0 1.5rem" : "0 auto 1.5rem",
      }}
    >
      <input
        className="flex-1 text-[0.88rem] px-3 py-2.5 bg-transparent border-none outline-none"
        style={{ color: "var(--text)", fontFamily: "var(--font-dm)" }}
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      {showTypeSelect && (
        <>
          <div
            className="w-px my-1.5"
            style={{ background: "var(--glass-border)" }}
          />
          <select
            className="bg-transparent border-none outline-none text-[0.8rem] px-3 cursor-pointer"
            style={{ color: "var(--muted)", fontFamily: "var(--font-dm)" }}
            value={type}
            onChange={(e) => onTypeChange(e.target.value as JobType)}
          >
            <option value="">All Types</option>
            <option value="Remote">Remote</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </>
      )}

      <button
        onClick={onSearch}
        className="font-syne font-semibold text-[0.82rem] px-5 py-2.5 rounded-xl border-none text-white transition-opacity duration-200 whitespace-nowrap"
        style={{ background: "var(--accent)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.85";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        Search Jobs →
      </button>
    </div>
  );
}
