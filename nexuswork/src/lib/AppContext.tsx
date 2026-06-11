"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Page, JobType, SortOption, Job } from "@/types";

// ─── Auth user shape ──────────────────────────────────────────────
interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "jobseeker" | "employer";
  company?: string;
}

interface AppState {
  currentPage: Page;
  savedJobs: Set<string>;        // changed: MongoDB IDs are strings
  searchQuery: string;
  searchType: JobType;
  categoryFilter: string;
  sortOption: SortOption;
  toast: string | null;
  applyJobId: string | null;     // changed: string ID
  modal: "apply" | "post" | "signin" | "signup" | null;
  postedJobs: Job[];
  // ── auth ──
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
}

interface AppContextValue extends AppState {
  setPage: (page: Page) => void;
  toggleSave: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setSearchType: (t: JobType) => void;
  setCategoryFilter: (cat: string) => void;
  setSortOption: (s: SortOption) => void;
  showToast: (msg: string) => void;
  openModal: (modal: AppState["modal"], jobId?: string) => void;
  closeModal: () => void;
  doSearch: (query?: string, type?: JobType) => void;
  // ── auth ──
  addPostedJob: (job: Job) => void;
  handleLogin: (token: string, user: AuthUser) => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<JobType>("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [toast, setToast] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [modal, setModal] = useState<AppState["modal"]>(null);

  // ── Auth state — hydrated from localStorage on first render ──────
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("nw_token");
    const storedUser  = localStorage.getItem("nw_user");
    if (storedToken) setToken(storedToken);
    if (storedUser)  {
      try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────

  const setPage = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      setSavedJobs((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast("Removed from saved jobs");
        } else {
          next.add(id);
          showToast("Saved! View in Saved Jobs tab.");
        }
        return next;
      });
    },
    [showToast]
  );

  const openModal = useCallback(
    (m: AppState["modal"], jobId?: string) => {
      setModal(m);
      if (jobId !== undefined) setApplyJobId(jobId);
    },
    []
  );

  const closeModal = useCallback(() => {
    setModal(null);
    setApplyJobId(null);
  }, []);

  const doSearch = useCallback(
    (query?: string, type?: JobType) => {
      if (query !== undefined) setSearchQuery(query);
      if (type !== undefined) setSearchType(type);
      setPage("jobs");
    },
    [setPage]
  );

  // ── Auth actions ─────────────────────────────────────────────────
  const handleLogin = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("nw_token", newToken);
    localStorage.setItem("nw_user", JSON.stringify(newUser));
  }, []);

  const addPostedJob = useCallback((job: Job) => {
    setPostedJobs((prev) => {
      // Check if job already exists to prevent duplicates when API also fetches it
      if (prev.find((j) => j._id === job._id)) return prev;
      return [job, ...prev];
    });
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setSavedJobs(new Set());
    localStorage.removeItem("nw_token");
    localStorage.removeItem("nw_user");
    setPage("home");
    showToast("Signed out successfully.");
  }, [setPage, showToast]);

  // ─────────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        currentPage,
        savedJobs,
        searchQuery,
        searchType,
        categoryFilter,
        sortOption,
        toast,
        applyJobId,
        modal,
        postedJobs,
        token,
        user,
        isLoggedIn: !!token,
        setPage,
        toggleSave,
        setSearchQuery,
        setSearchType,
        setCategoryFilter,
        setSortOption,
        showToast,
        openModal,
        closeModal,
        doSearch,
        addPostedJob,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}