"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { registerUser } from "@/lib/api";
import {
  Overlay,
  FormField,
  FormInput,
  FormSelect,
  SubmitButton,
} from "@/components/Overlay";

export function SignUpModal() {
  const { modal, closeModal, openModal, showToast, handleLogin } = useApp();

  const nameRef     = useRef<HTMLInputElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef  = useRef<HTMLInputElement>(null);
  const roleRef     = useRef<HTMLSelectElement>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const name     = nameRef.current?.value.trim() ?? "";
    const email    = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    const confirm  = confirmRef.current?.value ?? "";
    const role     = (roleRef.current?.value ?? "jobseeker") as "jobseeker" | "employer";

    // ── Basic validation ──────────────────────────────────────────
    if (!name || !email || !password) {
      showToast("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      showToast("Passwords do not match.");
      return;
    }

    // ── Call backend ──────────────────────────────────────────────
    setLoading(true);
    const res = await registerUser({ name, email, password, role });
    setLoading(false);

    if (!res.token) {
      showToast(res.message ?? "Registration failed. Try again.");
      return;
    }

    handleLogin(res.token, res.user);
    closeModal();
    showToast(`Welcome to NexusWork, ${res.user.name}! 🎉`);
  }

  return (
    <Overlay isOpen={modal === "signup"} maxWidth="420px">
      <h2
        className="font-syne font-extrabold text-xl mb-1"
        style={{ color: "var(--text)" }}
      >
        Create your account
      </h2>
      <p className="text-[0.82rem] mb-6" style={{ color: "var(--muted)" }}>
        Join 2.1M professionals on NexusWork — it's free.
      </p>

      <FormField label="Full Name">
        <FormInput ref={nameRef} placeholder="Jane Doe" type="text" />
      </FormField>

      <FormField label="Email">
        <FormInput ref={emailRef} placeholder="you@email.com" type="email" />
      </FormField>

      <FormField label="Password">
        <FormInput ref={passwordRef} placeholder="Min. 6 characters" type="password" />
      </FormField>

      <FormField label="Confirm Password">
        <FormInput ref={confirmRef} placeholder="Repeat password" type="password" />
      </FormField>

      <FormField label="I am a…">
        <FormSelect ref={roleRef} defaultValue="jobseeker">
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer / Hiring</option>
        </FormSelect>
      </FormField>

      <SubmitButton>
        <span onClick={handleSubmit}>
          {loading ? "Creating account…" : "Create Free Account →"}
        </span>
      </SubmitButton>

      <p className="text-center mt-4 text-[0.8rem]" style={{ color: "var(--muted)" }}>
        Already have an account?{" "}
        <button
          onClick={() => { closeModal(); openModal("signin"); }}
          className="border-none bg-transparent cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          Sign in →
        </button>
      </p>
    </Overlay>
  );
}