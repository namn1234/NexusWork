"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { loginUser } from "@/lib/api";
import {
  Overlay,
  FormField,
  FormInput,
  SubmitButton,
} from "@/components/Overlay";

export function SignInModal() {
  const { modal, closeModal, openModal, showToast, handleLogin } = useApp();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!email || !password) {
      showToast("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);

    if (!res.token) {
      showToast(res.message ?? "Login failed. Check your credentials.");
      return;
    }

    handleLogin(res.token, res.user);
    closeModal();
    showToast(`Welcome back, ${res.user.name}! 👋`);
  }

  return (
    <Overlay isOpen={modal === "signin"} maxWidth="400px">
      <h2 className="font-syne font-extrabold text-xl mb-1" style={{ color: "var(--text)" }}>
        Welcome back
      </h2>
      <p className="text-[0.82rem] mb-6" style={{ color: "var(--muted)" }}>
        Sign in to your NexusWork account
      </p>

      <FormField label="Email">
        <FormInput ref={emailRef} placeholder="you@email.com" type="email" />
      </FormField>
      <FormField label="Password">
        <FormInput ref={passwordRef} placeholder="••••••••" type="password" />
      </FormField>

      <SubmitButton>
        <span onClick={handleSubmit}>
          {loading ? "Signing in…" : "Sign In →"}
        </span>
      </SubmitButton>

      <p className="text-center mt-4 text-[0.8rem]" style={{ color: "var(--muted)" }}>
        No account?{" "}
        <button
          onClick={() => { closeModal(); openModal("signup"); }}
          className="border-none bg-transparent cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          Create one free →
        </button>
      </p>
    </Overlay>
  );
}