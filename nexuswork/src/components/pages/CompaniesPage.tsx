"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/AppContext";
import api from "@/lib/api";
import { COMPANIES } from "@/lib/data";
import { Company } from "@/types";

const INDUSTRIES = ["All", "Tech", "Finance", "Media", "Cloud"];

export function CompaniesPage() {
  const { showToast } = useApp();
  const [companies, setCompanies] = useState<Company[]>(COMPANIES);
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [following, setFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.fetchCompanies().then(({ companies }) => {
      if (Array.isArray(companies)) setCompanies(companies);
    });
  }, []);

  const filtered = useMemo(() =>
    companies.filter((c) =>
      (!query || c.name.toLowerCase().includes(query.toLowerCase())) &&
      (!industry || c.industry === industry)
    ),
    [companies, query, industry]
  );

  function toggleFollow(name: string) {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        showToast("Unfollowed");
      } else {
        next.add(name);
        showToast("Following company — you'll get job alerts");
      }
      return next;
    });
  }

  return (
    <div className="px-8 py-12">
      <div
        className="text-[0.68rem] font-medium tracking-[0.2em] uppercase mb-1"
        style={{ color: "var(--accent)" }}
      >
        ◇ Top Employers
      </div>
      <h1
        className="font-syne font-extrabold tracking-[-0.03em] mb-6"
        style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "var(--text)" }}
      >
        Companies Hiring Now
      </h1>

      {/* Search */}
      <div
        className="flex gap-1.5 p-1.5 rounded-2xl mb-6"
        style={{
          background: "rgba(13,19,33,0.95)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(24px)",
        }}
      >
        <input
          className="flex-1 text-[0.88rem] px-3 py-2.5 bg-transparent border-none outline-none"
          style={{ color: "var(--text)", fontFamily: "var(--font-dm)" }}
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="font-syne font-semibold text-[0.82rem] px-5 py-2.5 rounded-xl border-none text-white"
          style={{ background: "var(--accent)" }}
        >
          Search →
        </button>
      </div>

      {/* Industry filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {INDUSTRIES.map((ind) => {
          const val = ind === "All" ? "" : ind;
          const active = industry === val;
          return (
            <button
              key={ind}
              onClick={() => setIndustry(val)}
              className="text-[0.78rem] px-4 py-1.5 rounded-full border transition-all duration-200"
              style={{
                background: active ? "rgba(79,142,247,0.12)" : "var(--glass)",
                border: active
                  ? "1px solid rgba(79,142,247,0.4)"
                  : "1px solid var(--glass-border)",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {ind}
            </button>
          );
        })}
      </div>

      {/* Company grid */}
      <div
        className="grid gap-4 stagger-children"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
        {filtered.map((company) => {
          const isFollowing = following.has(company.name);
          return (
            <div
              key={company.name}
              className="rounded-2xl p-5 flex flex-col gap-2.5 cursor-pointer transition-all duration-200 border"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--glass-border)";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm text-white"
                style={{ background: company.col }}
              >
                {company.short}
              </div>
              <div className="font-syne font-bold text-[0.95rem]" style={{ color: "var(--text)" }}>
                {company.name}
              </div>
              <div className="text-[0.72rem]" style={{ color: "var(--muted)" }}>
                {company.industry}
              </div>
              <div className="text-[0.75rem] font-medium" style={{ color: "var(--accent3)" }}>
                ● {company.jobs.toLocaleString()} open roles
              </div>
              <button
                onClick={() => toggleFollow(company.name)}
                className="text-[0.72rem] font-syne font-semibold px-3 py-1.5 rounded-lg border mt-auto transition-all duration-200"
                style={{
                  background: "transparent",
                  color: isFollowing ? "var(--accent3)" : "var(--accent)",
                  border: isFollowing
                    ? "1px solid rgba(52,211,153,0.3)"
                    : "1px solid rgba(79,142,247,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(79,142,247,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {isFollowing ? "✓ Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
