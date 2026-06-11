"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { JobCard } from "@/components/JobCard";
import { useApp } from "@/lib/AppContext";
import api from "@/lib/api";
import { JOBS } from "@/lib/data";
import { JobType, SortOption, Job } from "@/types";

const FILTERS = ["All", "Engineering", "Design", "Product", "Data", "Marketing", "Security"];

export function JobsPage() {
  const {
    searchQuery,
    searchType,
    categoryFilter,
    sortOption,
    setSearchQuery,
    setSearchType,
    setCategoryFilter,
    setSortOption,
    postedJobs,
  } = useApp();

  const [apiJobs, setApiJobs] = useState<Job[]>(JOBS);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localType, setLocalType] = useState<JobType>(searchType);

  useEffect(() => {
    api.fetchJobs({ q: searchQuery, type: searchType, sort: sortOption }).then(({ jobs }) => {
      if (Array.isArray(jobs)) setApiJobs(jobs);
      else setApiJobs([]);
    });
  }, [searchQuery, searchType, sortOption]);

  const jobs = useMemo(() => [...postedJobs, ...apiJobs], [postedJobs, apiJobs]);

  function handleSearch() {
    setSearchQuery(localQuery);
    setSearchType(localType);
  }

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let results = jobs.filter((j) => {
      const title = j.title?.toString().toLowerCase() ?? "";
      const co = j.companyName?.toString().toLowerCase() ?? "";
      const cat = j.category?.toString().toLowerCase() ?? "";
      const matchQ =
        !q ||
        title.includes(q) ||
        co.includes(q) ||
        cat.includes(q);
      const matchType = !searchType || j.tags.includes(searchType);
      const matchCat = !categoryFilter || j.category === categoryFilter;
      return matchQ && matchType && matchCat;
    });

    if (sortOption === "salary") results.sort((a, b) => b.salaryMin - a.salaryMin);
    else if (sortOption === "company") results.sort((a, b) => a.companyName.localeCompare(b.companyName));

    return results;
  }, [searchQuery, searchType, categoryFilter, sortOption, jobs]);

  return (
    <div className="px-8 py-12">
      <div
        className="text-[0.68rem] font-medium tracking-[0.2em] uppercase mb-1"
        style={{ color: "var(--accent)" }}
      >
        ◈ All Positions
      </div>
      <h1
        className="font-syne font-extrabold tracking-[-0.03em] mb-6"
        style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "var(--text)" }}
      >
        Find Your Next Role
      </h1>

      {/* Search */}
      <SearchBox
        query={localQuery}
        type={localType}
        onQueryChange={setLocalQuery}
        onTypeChange={setLocalType}
        onSearch={handleSearch}
        placeholder="Job title, skill or company..."
        fullWidth
      />

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map((f) => {
          const val = f === "All" ? "" : f;
          const active = categoryFilter === val;
          return (
            <button
              key={f}
              onClick={() => setCategoryFilter(val)}
              className="text-[0.78rem] px-4 py-1.5 rounded-full border transition-all duration-200"
              style={{
                background: active ? "rgba(79,142,247,0.12)" : "var(--glass)",
                border: active
                  ? "1px solid rgba(79,142,247,0.4)"
                  : "1px solid var(--glass-border)",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="font-syne font-bold text-[0.88rem]" style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}>{filtered.length}</span> jobs found
        </div>
        <select
          className="text-[0.78rem] px-3 py-1.5 rounded-lg border outline-none"
          style={{
            background: "var(--glass)",
            border: "1px solid var(--glass-border)",
            color: "var(--text)",
            fontFamily: "var(--font-dm)",
          }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="recent">Most Recent</option>
          <option value="salary">Highest Salary</option>
          <option value="company">Company A–Z</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          className="grid gap-4 stagger-children"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))" }}
        >
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20"
          style={{ color: "var(--muted)" }}
        >
          No jobs match your search. Try different keywords.
        </div>
      )}
    </div>
  );
}
