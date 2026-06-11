# NexusWork — Backend API

Express + MongoDB REST API for the NexusWork job board frontend.

---

## Stack
| Layer | Tech |
|---|---|
| Server | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (7-day tokens) |
| Validation | express-validator |
| Rate limiting | express-rate-limit |
| Password hashing | bcryptjs (12 rounds) |

---

## Folder structure
```
nexuswork-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Mongoose connect
│   ├── middleware/
│   │   ├── auth.js            # protect / employerOnly guards
│   │   └── errorHandler.js    # central error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   └── Application.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── companyController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   └── companies.js
│   └── index.js               # entry point
└── scripts/
    └── seed.js                # sample data
```

---

## Quick start

```bash
# 1. Copy env file and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Seed sample data (optional)
npm run seed

# 4. Start dev server with hot-reload
npm run dev
```

Server listens on **http://localhost:5000** by default.

---

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `PORT` | Server port (default 5000) |
| `CLIENT_ORIGIN` | Frontend origin for CORS (default http://localhost:3000) |
| `NODE_ENV` | `development` or `production` |

---

## API Reference

All JSON. Protected routes require `Authorization: Bearer <token>` header.

- `GET /` — basic API health check
- `GET /api` — returns the available API routes list

**`GET /api` response example**
```json
{
  "routes": [
    { "method": "GET", "path": "/api", "description": "List available API routes" },
    { "method": "GET", "path": "/api/health", "description": "Health check" },
    { "method": "POST", "path": "/api/auth/register", "description": "Register user" }
  ]
}
```

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register (jobseeker or employer) |
| POST | `/api/auth/login` | — | Login — returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

**Register body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "jobseeker"          // or "employer"
}
```

**Login body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

---

### Jobs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | — | List jobs (with filters) |
| GET | `/api/jobs/featured` | — | Featured jobs (up to 6) |
| GET | `/api/jobs/:id` | — | Single job |
| GET | `/api/jobs/saved/list` | ✅ jobseeker | My saved jobs |
| POST | `/api/jobs/:id/save` | ✅ jobseeker | Toggle save/unsave |
| POST | `/api/jobs` | ✅ employer | Create job listing |
| PATCH | `/api/jobs/:id` | ✅ employer | Update own job |
| DELETE | `/api/jobs/:id` | ✅ employer | Soft-delete own job |

**GET /api/jobs query params**

| Param | Example | Description |
|---|---|---|
| `q` | `designer` | Full-text search |
| `category` | `Engineering` | Filter by category |
| `type` | `Remote` | Filter by tag |
| `remote` | `true` | Remote jobs only |
| `sort` | `recent` / `salary` / `company` | Sort order |
| `page` | `1` | Page number |
| `limit` | `12` | Results per page |

**POST /api/jobs body**
```json
{
  "title": "Senior Engineer",
  "companyId": "<mongoId>",
  "salary": "$140–185K",
  "salaryMin": 140,
  "salaryMax": 185,
  "location": "🌎 Worldwide",
  "remote": true,
  "tags": ["Remote", "Full-time"],
  "category": "Engineering",
  "description": "Join our platform team...",
  "featured": false
}
```

---

### Applications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/applications` | ✅ jobseeker | Submit application |
| GET | `/api/applications/mine` | ✅ jobseeker | My applications |
| GET | `/api/applications/job/:jobId` | ✅ employer | Applications for a job |
| PATCH | `/api/applications/:id/status` | ✅ employer | Update status |

**POST /api/applications body** (matches ApplyModal fields)
```json
{
  "jobId": "<mongoId>",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "portfolioUrl": "https://janedoe.dev",
  "coverLetter": "I'm a great fit because...",
  "availability": "Immediately"
}
```

**PATCH /api/applications/:id/status body**
```json
{ "status": "shortlisted" }
// pending | reviewed | shortlisted | rejected
```

---

### Companies

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/companies` | — | List all companies |
| GET | `/api/companies/:id` | — | Company + its jobs |
| POST | `/api/companies` | ✅ employer | Create company profile |

---

## Connecting the Next.js frontend

Create `src/lib/api.ts` in the frontend and replace hardcoded `JOBS`/`COMPANIES` data with real fetches:

```ts
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function fetchJobs(params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/jobs${qs ? "?" + qs : ""}`);
  return res.json(); // { jobs, total, page, pages }
}

export async function applyToJob(token: string, body: object) {
  const res = await fetch(`${API}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}
```

Then add `NEXT_PUBLIC_API_URL=http://localhost:5000/api` to `.env.local` in the frontend.

---

## Deployment tips

- **MongoDB Atlas** — free M0 cluster works fine for development; swap `MONGODB_URI` to the Atlas connection string.
- **Railway / Render / Fly.io** — push the backend as a Node service; set env vars in the dashboard.
- **Vercel** — deploy the Next.js frontend separately; point `NEXT_PUBLIC_API_URL` at the backend URL.
