"use client";

import React, { useEffect, ReactNode } from "react";
import { useApp } from "@/lib/AppContext";

interface OverlayProps {
  isOpen: boolean;
  children: ReactNode;
  maxWidth?: string;
}

export function Overlay({ isOpen, children, maxWidth = "540px" }: OverlayProps) {
  const { closeModal } = useApp();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className="relative rounded-2xl p-8 overflow-y-auto animate-fade-in"
        style={{
          background: "#0d1321",
          border: "1px solid var(--glass-border)",
          width: `min(${maxWidth}, 95vw)`,
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 text-sm"
          style={{
            background: "var(--glass)",
            border: "1px solid var(--glass-border)",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

// Form field helpers
interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        className="block text-[0.78rem] font-medium uppercase tracking-wider mb-1.5"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--glass-border)",
  borderRadius: "10px",
  padding: "0.65rem 0.9rem",
  color: "var(--text)",
  fontFamily: "var(--font-dm)",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s",
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      style={inputBase}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.5)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
      {...props}
    />
  );
});
FormInput.displayName = "FormInput";

export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(({ children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      style={{ ...inputBase, cursor: "pointer" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.5)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
      {...props}
    >
      {children}
    </select>
  );
});
FormSelect.displayName = "FormSelect";

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return (
    <textarea
      ref={ref}
      style={{ ...inputBase, resize: "vertical", minHeight: "100px" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.5)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
      {...props}
    />
  );
});
FormTextarea.displayName = "FormTextarea";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  return (
    <button
      type="button"
      className="w-full font-syne font-bold text-sm py-3 rounded-xl border-none mt-2 transition-all duration-200"
      style={{ background: "var(--accent)", color: "#fff" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.85";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      {...props}
    >
      {children}
    </button>
  );
}
