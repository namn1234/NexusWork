const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Auth ────────────────────────────────────────────────────────
export async function registerUser(data: {
  name: string; email: string; password: string; role?: string;
}) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json(); // { token, user }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json(); // { token, user }
}

// ─── Jobs ────────────────────────────────────────────────────────
export async function fetchJobs(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API}/jobs${qs}`);
  return res.json(); // { jobs, total, page, pages }
}

export async function fetchFeaturedJobs() {
  const res = await fetch(`${API}/jobs/featured`);
  return res.json(); // { jobs }
}

export async function saveJob(jobId: string, token: string) {
  const res = await fetch(`${API}/jobs/${jobId}/save`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json(); // { saved: true/false }
}

export async function createJob(data: object, token: string) {
  const res = await fetch(`${API}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── Applications ────────────────────────────────────────────────
export async function submitApplication(data: object, token: string) {
  const res = await fetch(`${API}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── Companies ───────────────────────────────────────────────────
export async function fetchCompanies() {
  const res = await fetch(`${API}/companies`);
  return res.json(); // { companies }
}

const api = {
  registerUser,
  loginUser,
  fetchJobs,
  fetchFeaturedJobs,
  saveJob,
  submitApplication,
  fetchCompanies,
  createJob,
};

export default api;