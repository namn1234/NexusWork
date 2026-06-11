# NexusWork — Job Portal

A production-grade job portal built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features an animated canvas hero, real-time filtering, modal system, toast notifications, and a saved-jobs tracker — all in a clean component architecture.

## ✦ Live Demo

Deploy in one click ↓

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nexuswork)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

## 📦 Build & Deploy

```bash
# Production build
npm run build
npm start

# Deploy to Vercel (zero config)
npx vercel
```

---

## 🗂 Project Structure

```
nexuswork/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, metadata
│   │   ├── page.tsx            # App shell + provider wiring
│   │   └── globals.css         # CSS variables, animations, base styles
│   │
│   ├── components/
│   │   ├── ScrollyCanvas.tsx   # Animated WebGL-style hero background
│   │   ├── Nav.tsx             # Sticky navigation bar
│   │   ├── JobCard.tsx         # Reusable job listing card
│   │   ├── Overlay.tsx         # Modal base + form field primitives
│   │   ├── SearchBox.tsx       # Reusable search + type filter
│   │   ├── Toast.tsx           # Animated notification toast
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx    # Hero, stats, featured jobs, categories, CTA
│   │   │   ├── JobsPage.tsx    # Full job list with search/filter/sort
│   │   │   ├── CompaniesPage.tsx  # Company directory with follow
│   │   │   └── SavedPage.tsx   # Saved jobs list / empty state
│   │   │
│   │   └── modals/
│   │       ├── ApplyModal.tsx  # Job application form
│   │       ├── PostJobModal.tsx # Employer job posting form
│   │       ├── SignInModal.tsx  # Auth sign in
│   │       └── SignUpModal.tsx  # Auth sign up / registration
│   │
│   ├── lib/
│   │   ├── data.ts             # All mock data (jobs, companies, categories)
│   │   └── AppContext.tsx      # Global state (React Context + hooks)
│   │
│   └── types/
│       └── index.ts            # TypeScript interfaces & types
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── postcss.config.mjs
```

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + CSS custom properties |
| Fonts | Syne (display) + DM Sans (body) via `next/font` |
| Animation | CSS animations + Canvas API |
| State | React Context + `useState` / `useCallback` |
| Deploy | Vercel (zero config) |

---

## ✨ Features

- **Animated canvas hero** — floating orbs + twinkling stars rendered via `requestAnimationFrame`
- **Multi-page SPA routing** — Home, Jobs, Companies, Saved (no page reloads)
- **Real-time job filtering** — by keyword, type (remote/full-time/etc), category, and sort order
- **Modal system** — Apply, Post Job, Sign In, Sign Up — with keyboard (`Escape`) and backdrop close
- **Save jobs** — persisted in React state, with live badge on nav
- **Company follow** — toggle follow per company with toast feedback
- **Toast notifications** — animated slide-in/out
- **Responsive design** — works on mobile through 4K

---

## 🎨 Design System

All design tokens are CSS custom properties in `globals.css`:

```css
--bg: #080c14          /* page background */
--surface: #0d1321     /* elevated surface */
--glass: rgba(255,255,255,0.04)   /* glassmorphism fill */
--glass-border: rgba(255,255,255,0.08)
--accent: #4f8ef7      /* primary blue */
--accent2: #a78bfa     /* purple */
--accent3: #34d399     /* green */
--text: #e8edf5
--muted: #6b7a99
```

---

## 📝 Extending with Real Data

Replace `src/lib/data.ts` with API calls:

```typescript
// src/lib/data.ts  →  src/lib/api.ts
export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch('/api/jobs');
  return res.json();
}
```

Then update `JobsPage.tsx` to use `useEffect` + `useState` for async data fetching, or use React Server Components for SSR.

---

## 📄 License

MIT — free to use, modify, and deploy.
