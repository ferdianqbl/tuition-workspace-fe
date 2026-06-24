# Frontend Planning & Architecture - Tuition Case Workspace

This folder contains the UI plans, design guidelines, and routing architectures for the Next.js React frontend.

---

## 1. Document Index

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

## 3. Frontend Architecture Layout

The frontend isolates layout configurations, pages, and components using a clean feature-based layout:

- **`src/app/`**: Next.js routing definitions.
- **`src/components/features/`**: Folder structures separating components by business feature areas (e.g. `auth/`, `cases/`, `tutors/`). Ensures small files and modular maintainability.
- **`src/components/shared/`**: Reusable page states (loaders, 404 cards, access denied guards).
- **`src/components/ui/`**: Styled primitives mapped to Shadcn UI modules (Card, Input, Dialog, Button, Select, Tabs, etc.).
- **`src/services/`**: API fetching utilities using Axios clients and TanStack React Query mutations/queries.
- **`src/lib/`**: Network configurations.
- **`src/types/`**: Type definitions.

---

## 4. State Management & Query Cache

- **Server Cache**: Maintained using TanStack Query. Provides request states (`isLoading`, `isPending`, `error`) and automated cache invalidation upon query mutations.
- **Local Credentials State**: Stores session parameters and access tokens securely in `localStorage` to persist active sessions across page reloads.
