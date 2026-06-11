"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { submitApplication } from "@/lib/api";
import { JOBS } from "@/lib/data";
import {
  Overlay,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from "@/components/Overlay";

export function ApplyModal() {
  const { modal, applyJobId, closeModal, showToast, openModal, token } = useApp();
  const job = JOBS.find((j) => String(j._id) === String(applyJobId));

  const nameRef     = useRef<HTMLInputElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const coverRef    = useRef<HTMLTextAreaElement>(null);
  const availRef    = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    // If not logged in, redirect to sign in first
    if (!token) {
      closeModal();
      openModal("signin");
      showToast("Please sign in to apply.");
      return;
    }

    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";

    if (!name || !email) {
      showToast("Name and email are required.");
      return;
    }

    setLoading(true);
    const res = await submitApplication(
      {
        jobId: String(applyJobId),
        name,
        email,
        portfolioUrl: portfolioRef.current?.value,
        coverLetter:  coverRef.current?.value,
        availability: availRef.current?.value ?? "Immediately",
      },
      token
    );
    setLoading(false);

    if (res.application) {
      closeModal();
      showToast("Application submitted! ✓ They'll be in touch soon.");
    } else {
      showToast(res.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <Overlay isOpen={modal === "apply"}>
      <h2
        className="font-syne font-extrabold text-xl mb-1"
        style={{ color: "var(--text)" }}
      >
        {job?.title ?? "Apply Now"}
      </h2>
      <p className="text-[0.82rem] mb-6" style={{ color: "var(--muted)" }}>
        {job ? `${job.companyName} · ${job.tags[0]} · ${job.salary}` : ""}
      </p>

      <FormField label="Full Name">
        <FormInput ref={nameRef} placeholder="Your name" type="text" />
      </FormField>
      <FormField label="Email">
        <FormInput ref={emailRef} placeholder="you@email.com" type="email" />
      </FormField>
      <FormField label="LinkedIn / Portfolio URL">
        <FormInput ref={portfolioRef} placeholder="https://" type="url" />
      </FormField>
      <FormField label="Why are you a great fit?">
        <FormTextarea ref={coverRef} placeholder="Tell them what makes you stand out..." />
      </FormField>
      <FormField label="Availability">
        <FormSelect ref={availRef} defaultValue="Immediately">
          <option>Immediately</option>
          <option>2 weeks notice</option>
          <option>1 month notice</option>
          <option>Flexible</option>
        </FormSelect>
      </FormField>

      <SubmitButton>
        <span onClick={handleSubmit}>
          {loading ? "Submitting…" : "Submit Application →"}
        </span>
      </SubmitButton>
    </Overlay>
  );
}