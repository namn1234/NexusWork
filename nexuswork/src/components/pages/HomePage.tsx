"use client";

import { useEffect, useState } from "react";
import { ScrollyCanvas } from "@/components/ScrollyCanvas";
import { SearchBox } from "@/components/SearchBox";
import { JobCard } from "@/components/JobCard";
import { useApp } from "@/lib/AppContext";
import api from "@/lib/api";
import { JOBS, CATEGORIES } from "@/lib/data";
import { Job, JobType } from "@/types";

const STATS = [
  { num: "120K+", label: "Active Positions" },
  { num: "8,400", label: "Companies Hiring" },
  { num: "2.1M", label: "Professionals" },
  { num: "94%", label: "Placement Rate" },
];

const POPULAR_SEARCHES = ["Designer", "Engineer", "Product", "Remote", "AI / ML"];

export function HomePage() {
  const { setPage, openModal, doSearch } = useApp();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<JobType>("");

  useEffect(() => {
    api.fetchFeaturedJobs().then(({ jobs }) => {
      if (Array.isArray(jobs)) setFeaturedJobs(jobs);
    });
  }, []);

  function handleSearch() {
    doSearch(query, type);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-8 py-16 overflow-hidden">
        <ScrollyCanvas />

        <div className="relative z-10 animate-fade-in-up">
          {/* Tag */}
          <div
            className="inline-block text-[0.68rem] font-medium tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border"
            style={{ color: "var(--accent)", borderColor: "rgba(79,142,247,0.3)" }}
          >
            🚀 120K+ jobs live today
          </div>

          {/* Headline */}
          <h1
            className="font-syne font-extrabold leading-[0.95] tracking-[-0.04em] mb-5"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              background: "linear-gradient(165deg, #fff 30%, rgba(255,255,255,0.45))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Find Work That
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Matters.
            </span>
          </h1>

          <p
            className="text-base max-w-[480px] mx-auto mb-8 leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Connect with world-class companies building the future. Your next chapter starts here.
          </p>

          {/* Search */}
          <SearchBox
            query={query}
            type={type}
            onQueryChange={setQuery}
            onTypeChange={setType}
            onSearch={handleSearch}
          />

          {/* Popular tags */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <span className="text-[0.72rem] mr-1" style={{ color: "var(--muted)" }}>
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => doSearch(term)}
                className="text-[0.72rem] px-3 py-1 rounded-full border transition-all duration-200"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(79,142,247,0.4)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div
        className="flex justify-around flex-wrap gap-6 px-8 py-6"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--glass-border)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="font-syne font-extrabold text-3xl"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.num}
            </div>
            <div
              className="text-[0.72rem] tracking-wider mt-0.5"
              style={{ color: "var(--muted)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Featured jobs */}
      <section className="px-8 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div
              className="text-[0.68rem] font-medium tracking-[0.2em] uppercase mb-1"
              style={{ color: "var(--accent)" }}
            >
              ↗ Featured Roles
            </div>
            <h2
              className="font-syne font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--text)" }}
            >
              Curated for You
            </h2>
          </div>
          <button
            onClick={() => setPage("jobs")}
            className="text-[0.78rem] font-medium px-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              background: "transparent",
              color: "var(--accent)",
              border: "1px solid rgba(79,142,247,0.3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,142,247,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            View all 120K jobs →
          </button>
        </div>

        <div className="grid gap-4 stagger-children" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {featuredJobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12" style={{ background: "var(--surface)" }}>
        <div
          className="text-[0.68rem] font-medium tracking-[0.2em] uppercase mb-1"
          style={{ color: "var(--accent)" }}
        >
          ◈ Explore by Field
        </div>
        <h2
          className="font-syne font-extrabold tracking-[-0.03em] mb-6"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--text)" }}
        >
          Browse Categories
        </h2>
        <div
          className="grid gap-3 stagger-children"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setPage("jobs");
              }}
              className="rounded-xl p-5 text-center cursor-pointer transition-all duration-200 border"
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
              <span className="block text-2xl mb-1.5">{cat.icon}</span>
              <div className="font-syne font-bold text-[0.8rem]" style={{ color: "var(--text)" }}>
                {cat.name}
              </div>
              <div className="text-[0.68rem] mt-0.5" style={{ color: "var(--muted)" }}>
                {cat.count} jobs
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="px-8 pb-12 pt-4">
        <div
          className="rounded-2xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(79,142,247,0.12),rgba(167,139,250,0.08))",
            border: "1px solid rgba(79,142,247,0.18)",
          }}
        >
          <h2
            className="font-syne font-extrabold tracking-[-0.03em] mb-3"
            style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--text)" }}
          >
            Ready to Make Your Move?
          </h2>
          <p
            className="mb-7 max-w-[400px] mx-auto text-[0.9rem]"
            style={{ color: "var(--muted)" }}
          >
            Join 2.1 million professionals who found their dream job through NexusWork.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => openModal("signup")}
              className="font-syne font-bold text-[0.88rem] px-7 py-3 rounded-xl border-none text-white transition-all duration-200"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 24px rgba(79,142,247,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 32px rgba(79,142,247,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(79,142,247,0.25)";
              }}
            >
              Create Free Profile →
            </button>
            <button
              onClick={() => setPage("jobs")}
              className="font-syne font-bold text-[0.88rem] px-7 py-3 rounded-xl transition-all duration-200"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--glass-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.background = "var(--glass)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
