"use client";

import { useApp } from "@/lib/AppContext";
import { JobCard } from "@/components/JobCard";
import { JOBS } from "@/lib/data";

export function SavedPage() {
  const { savedJobs, setPage } = useApp();
  const saved = JOBS.filter((j) => savedJobs.has(j._id));

  return (
    <div className="px-8 py-12">
      <div
        className="text-[0.68rem] font-medium tracking-[0.2em] uppercase mb-1"
        style={{ color: "var(--accent)" }}
      >
        ♡ My List
      </div>
      <h1
        className="font-syne font-extrabold tracking-[-0.03em] mb-8"
        style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "var(--text)" }}
      >
        Saved Jobs
      </h1>

      {saved.length > 0 ? (
        <div
          className="grid gap-4 stagger-children"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))" }}
        >
          {saved.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="block text-5xl mb-4">🔖</span>
          <h2
            className="font-syne font-bold text-lg mb-2"
            style={{ color: "var(--text)" }}
          >
            No saved jobs yet
          </h2>
          <p className="text-[0.82rem] mb-6" style={{ color: "var(--muted)" }}>
            Click the ♡ on any job card to save it here
          </p>
          <button
            onClick={() => setPage("jobs")}
            className="font-syne font-bold text-[0.88rem] px-7 py-3 rounded-xl border-none text-white transition-all duration-200"
            style={{ background: "var(--accent)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Browse Jobs →
          </button>
        </div>
      )}
    </div>
  );
}
