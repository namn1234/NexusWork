"use client";

import { AppProvider } from "@/lib/AppContext";
import { Nav } from "@/components/Nav";
import { HomePage } from "@/components/pages/HomePage";
import { JobsPage } from "@/components/pages/JobsPage";
import { CompaniesPage } from "@/components/pages/CompaniesPage";
import { SavedPage } from "@/components/pages/SavedPage";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { ApplyModal } from "@/components/modals/ApplyModal";
import { PostJobModal } from "@/components/modals/PostJobModal";
import { SignInModal } from "@/components/modals/SignInModal";
import { SignUpModal } from "@/components/modals/SignUpModal";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/AppContext";

function AppShell() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      {currentPage === "home" && <HomePage />}
      {currentPage === "jobs" && <JobsPage />}
      {currentPage === "companies" && <CompaniesPage />}
      {currentPage === "saved" && <SavedPage />}
      {currentPage === "profile" && <ProfilePage />}

      <ApplyModal />
      <PostJobModal />
      <SignInModal />
      <SignUpModal />
      <Toast />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
