# Frontend Planning & Architecture - Tuition Case Workspace

This folder contains the UI plans, design guidelines, and routing architectures for the Next.js React frontend.

---

## 1. Document Index

- **System Architecture**: Read about the rendering pipeline, state caching, and auth flow in [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).
- **UI/UX Design System**: Read about colors, typography, roundings, and primitive components in [DESIGN.md](./DESIGN.md).

---

## 2. Next.js Routing Map (`/fe/src/app`)

Next.js App Router folders serve exclusively as clean routing entrypoints, delegating implementation to feature components:

| Route Path | Rendered Feature Component | Role Access |
|---|---|---|
| `/` | `<AuthPage />` | Public (Login / Register Tabs) |
| `/dashboard` | `<DashboardPage />` | Authenticated (Parent/Tutor Dashboard) |
| `/profile` | `<ProfilePage />` | `TUTOR` (Manage self tutor profile) |
| `/tutors` | `<TutorsPage />` | `PARENT` (Tutor search directory) |
| `/tutors/:id` | `<TutorDetailPage />` | `PARENT` (View tutor details) |
| `/cases` | `<CasesPage />` | `PARENT` / `TUTOR` (Browse cases list) |
| `/cases/:id` | `<CaseDetailPage />` | `PARENT` / `TUTOR` (Active case workspace) |

---

## 3. Vercel Deployment & Environment Settings

- **Framework**: Next.js App Router (built dynamically during Vercel builds).
- **Environment Variables**:
  - `NEXT_PUBLIC_API_BASE_URL`: Configured in the Vercel dashboard to point to the backend API.
    - Local Development: `http://localhost:8000/api`
    - Production Vercel: `https://tuition-workspace-api.vercel.app/api`
- **Network Interface**: Axios network queries automatically read this base endpoint to resolve all data exchanges.
