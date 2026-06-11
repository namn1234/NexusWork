"use client";

import { Job } from "@/types";
import { useApp } from "@/lib/AppContext";

interface JobCardProps {
  job: Job;
  showSave?: boolean;
}

const tagStyles: Record<string, React.CSSProperties> = {
  Remote: {
    color: "#34d399",
    borderColor: "rgba(52,211,153,0.25)",
    background: "rgba(52,211,153,0.06)",
  },
  "Full-time": {
    color: "#a78bfa",
    borderColor: "rgba(167,139,250,0.25)",
    background: "rgba(167,139,250,0.06)",
  },
  "Part-time": {
    color: "#fb923c",
    borderColor: "rgba(251,146,60,0.25)",
    background: "rgba(251,146,60,0.06)",
  },
  Contract: {
    color: "#38bdf8",
    borderColor: "rgba(56,189,248,0.25)",
    background: "rgba(56,189,248,0.06)",
  },
};

export function JobCard({ job, showSave = true }: JobCardProps) {
  const { savedJobs, toggleSave, openModal } = useApp();
  const isSaved = savedJobs.has(job._id);

  return (
    <div
      className="relative rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
      style={{
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        overflow: "hidden",
      }}
      onClick={() => openModal("apply", job._id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "rgba(79,142,247,0.25)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Featured badge */}
      {job.featured && (
        <div
          className="absolute top-3 right-3 text-[0.62rem] font-semibold tracking-wider px-2 py-0.5 rounded-full"
          style={{
            color: "var(--accent)",
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.2)",
          }}
        >
          ✦ Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm text-white flex-shrink-0"
          style={{ background: job.logoColor }}
        >
          {job.companyShort}
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {job.companyName}
          </div>
          <div className="font-syne font-bold text-[0.95rem] leading-tight">
            {job.title}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-[0.67rem] font-medium px-2 py-0.5 rounded-full border"
            style={tagStyles[tag] ?? tagStyles["Contract"]}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p
        className="text-[0.78rem] leading-relaxed mb-3 line-clamp-[8]"
        style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}
      >
        {job.description}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--glass-border)" }}
      >
        <div>
          <div className="font-syne font-bold text-[0.88rem]">{job.salary}</div>
          <div className="text-[0.7rem]" style={{ color: "var(--muted)" }}>
            {job.location}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(job._id);
              }}
              className="text-base border-none transition-colors duration-200"
              style={{
                background: "transparent",
                color: isSaved ? "#ef4444" : "var(--muted)",
              }}
              title={isSaved ? "Remove from saved" : "Save job"}
              aria-label={isSaved ? "Remove from saved" : "Save job"}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal("apply", job._id);
            }}
            className="text-[0.72rem] font-syne font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
            style={{
              background: "transparent",
              color: "var(--accent)",
              border: "1px solid rgba(79,142,247,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(79,142,247,0.12)";
              e.currentTarget.style.borderColor = "rgba(79,142,247,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
