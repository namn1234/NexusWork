"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/AppContext";
import {
  Overlay,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/Overlay";
import { Job, Company } from "@/types";
import api from "@/lib/api";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];

export function PostJobModal() {
  const {
    modal,
    closeModal,
    showToast,
    addPostedJob,
    setPage,
    setSearchQuery,
    setSearchType,
    setCategoryFilter,
    token,
  } = useApp();
  const [title, setTitle] = useState("");
  const companyRef = useRef<HTMLSelectElement>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (modal === "post") {
      api.fetchCompanies().then((res) => {
        if (Array.isArray(res.companies)) setCompanies(res.companies);
      });
    }
  }, [modal]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [roleOverview, setRoleOverview] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [benefits, setBenefits] = useState("");
  const [howToApply, setHowToApply] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(["Full-time"])
  );

  function toggleType(type: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  async function handleSubmit() {
    const companyId = companyRef.current?.value;
    if (!title.trim() || !companyId || !location.trim() || !roleOverview.trim()) {
      showToast("Please fill in at least the role overview and required fields.");
      return;
    }

    const salaryRaw = maxSalary || minSalary;
    const salary = salaryRaw ? `$${minSalary || salaryRaw}K${maxSalary ? `–${maxSalary}K` : ""}` : "Competitive";
    const salaryNum = Number(maxSalary || minSalary || 0);

    const formattedDescription = `🏢 About the company
${companies.find((c) => c._id === companyId)?.name || "Our Company"} is looking for a ${title}.

📋 Role overview
${roleOverview.trim()}

✅ Responsibilities
${responsibilities.trim()}

🎓 Requirements
${requirements.trim()}

⭐ Nice to have
${niceToHave.trim()}

💰 Compensation & benefits
${benefits.trim() || salary}

📅 How to apply
${howToApply.trim()}`;

    setLoading(true);
    const res = await api.createJob(
      {
        title: title.trim(),
        companyId,
        salary,
        salaryMin: salaryNum,
        salaryMax: Number(maxSalary || 0),
        location: location.trim(),
        tags: Array.from(selectedTypes),
        category: "Engineering",
        description: formattedDescription,
        featured: false,
      },
      token!
    );
    setLoading(false);

    if (!res.job) {
      showToast(res.message || "Failed to post job");
      return;
    }

    addPostedJob(res.job);
    setSearchQuery("");
    setSearchType("");
    setCategoryFilter("");
    setPage("jobs");
    closeModal();
    showToast("Job posted! Your listing is now live.");
    setTitle("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setRoleOverview("");
    setResponsibilities("");
    setRequirements("");
    setNiceToHave("");
    setBenefits("");
    setHowToApply("");
    setSelectedTypes(new Set(["Full-time"]));
  }

  return (
    <Overlay isOpen={modal === "post"}>
      <h2 className="font-syne font-extrabold text-xl mb-1" style={{ color: "var(--text)" }}>
        Post a Job
      </h2>
      <p className="text-[0.82rem] mb-6" style={{ color: "var(--muted)" }}>
        Reach 2.1M professionals instantly
      </p>

      <FormField label="Job Title">
        <FormInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Company">
          <FormSelect ref={companyRef}>
            <option value="">Select your company</option>
            {companies.map((c) => (
              <option key={c._id || c.name} value={c._id}>
                {c.name}
              </option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Location">
          <FormInput
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remote / City"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Min Salary ($K)">
          <FormInput
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            placeholder="e.g. 120"
            type="number"
          />
        </FormField>
        <FormField label="Max Salary ($K)">
          <FormInput
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            placeholder="e.g. 180"
            type="number"
          />
        </FormField>
      </div>

      <FormField label="Job Type">
        <div className="flex flex-wrap gap-2 mt-1">
          {JOB_TYPES.map((type) => {
            const active = selectedTypes.has(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="text-[0.75rem] px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background: active ? "rgba(79,142,247,0.12)" : "var(--glass)",
                  border: active
                    ? "1px solid rgba(79,142,247,0.4)"
                    : "1px solid var(--glass-border)",
                  color: active ? "var(--accent)" : "var(--muted)",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Role Overview">
        <FormTextarea
          value={roleOverview}
          onChange={(e) => setRoleOverview(e.target.value)}
          placeholder="A brief summary of the role..."
          style={{ minHeight: "60px" }}
        />
      </FormField>
      <FormField label="Responsibilities">
        <FormTextarea
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          placeholder="- Write code&#10;- Attend meetings"
          style={{ minHeight: "80px" }}
        />
      </FormField>
      <FormField label="Requirements">
        <FormTextarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="- 3+ years of React&#10;- Good communication"
          style={{ minHeight: "80px" }}
        />
      </FormField>
      <FormField label="Nice to Have">
        <FormTextarea
          value={niceToHave}
          onChange={(e) => setNiceToHave(e.target.value)}
          placeholder="- Experience with Node.js"
          style={{ minHeight: "60px" }}
        />
      </FormField>
      <FormField label="Benefits & Perks">
        <FormTextarea
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="- Health insurance&#10;- Remote work options"
          style={{ minHeight: "60px" }}
        />
      </FormField>
      <FormField label="How to Apply">
        <FormTextarea
          value={howToApply}
          onChange={(e) => setHowToApply(e.target.value)}
          placeholder="Click the apply button or email jobs@company.com"
          style={{ minHeight: "60px" }}
        />
      </FormField>

      <SubmitButton onClick={handleSubmit}>{loading ? "Publishing..." : "Publish Job →"}</SubmitButton>
    </Overlay>
  );
}
