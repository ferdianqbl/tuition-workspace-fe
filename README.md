# 🎓 Tuition Case Workspace - Frontend Application

This is the Next.js React frontend client for the Tuition Case Workspace platform, built using React, Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 🌐 Live Deployments & Repositories

- **Frontend Client Web App**: [Live Deployment (Vercel)](https://tuition-workspace-fe.vercel.app/) | [GitHub Repository](https://github.com/ferdianqbl/tuition-workspace-fe)
- **Backend API Gateway**: [Live API Swagger Docs (Vercel)](https://tuition-workspace-api.vercel.app/api/docs) | [GitHub Repository](https://github.com/ferdianqbl/tuition-workspace-api)

---

## 📄 Documentation Index

### Frontend Documentation (Local Relative Links)
- **Product Requirement Document**: Read the platform's vision, roles, features, and validation results in [plans/PRD.md](./plans/PRD.md).
- **Validation Results**: Read the frontend validation checklist and compile results in [plans/VALIDATION.md](./plans/VALIDATION.md).
- **Master Plan & Routing**: Read about Next.js page maps and paths in [plans/PLANNING.md](./plans/PLANNING.md).
- **System Architecture**: Read about the Axios interceptors, caching layers, and folder maps in [plans/SYSTEM_ARCHITECTURE.md](./plans/SYSTEM_ARCHITECTURE.md).
- **UI/UX Design System**: Read about colors, typography, roundings, and styled primitives in [plans/DESIGN.md](./plans/DESIGN.md).

### Connected Backend Documentation (GitHub Absolute Links)
- **Backend Product Requirement Document**: Read about system scope, roles, and backend requirements in [plans/PRD.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/PRD.md).
- **Backend Validation Results**: Read the backend validation checklist and database config results in [plans/VALIDATION.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/VALIDATION.md).
- **Backend System Architecture**: Read about Express middleware configurations and Supabase/Prisma pooling in [plans/SYSTEM_ARCHITECTURE.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/SYSTEM_ARCHITECTURE.md).
- **Backend API Specs**: Read about endpoint paths, payloads, and response interfaces in [plans/API.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/API.md).
- **Backend Master Plan**: Read about planning roadmaps and the database ERD in [plans/PLANNING.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/PLANNING.md).

---

## 🧠 Technical Design Decisions & Justifications (Frontend)

Here are the technical explanations and justifications for the frontend architecture, error recovery, and user interface policies as required by the technical test specification.

### 1. Framework & UI Stack Choices
* **Core Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
  * *Justification*: The Next.js App Router enforces clean page layouts, server-side data preparation, and metadata mapping. Utilizing React 19 gives us optimal rendering performance and compiler support.
* **Styling**: **Tailwind CSS v4** with CSS-variables-based tokens.
  * *Justification*: Tailwind CSS v4 provides instant compile speeds and a modern setup using standard CSS stylesheets. Design components (Card, Input, Dialog, Select, etc.) are styled consistently with a premium obsidian-dark aesthetic.
* **State Management & Query Fetching**: **Zustand** (global session storage) and **TanStack React Query v5** (server cache sync).
  * *Justification*: TanStack Query automates client cache validation, loading states, retries, and network error handling, eliminating raw `useEffect` API loops. Zustand handles lightweight user state variables cleanly.

### 2. Session Expiry & Auto-Logout Flow (Section A)
* **Pure Cookie Auth Flow**:
  * Session credentials are saved strictly inside secure, HTTP-only browser cookies, removing any dependency on `localStorage` or JWT storage in client-side scripts.
  * The Axios client in [index.tsx](file:///Users/ferdianqbl/_WORK/Exploration/FS/tech-test/sibyl/tuition-workspace/fe/src/lib/axios/index.tsx) is configured with `withCredentials: true` globally so the browser automatically handles cookie transmission.
  * An Axios response interceptor monitors all request responses:
    * If a request fails with a `401 Unauthorized` status (indicating token cookie expiration or deletion), the interceptor immediately clears memory caches and redirects the browser window back to `/`, prompting the user to log in again.

### 3. Graceful Error Handling & UI Permissions (Section C)
* **Reflecting Permissions in the UI**:
  * Action items such as *Edit Case Details*, *Invite Tutors*, *Revoke Tutors*, and *Delete Documents* are conditionally rendered. The UI checks the logged-in user's role and case ownership (e.g. `user.id === case.userId` or `user.role === 'ADMIN'`) before displaying these buttons.
* **Graceful HTTP Error Boundary Handling**:
  * If a user manually edits a URL route to access a case they are not invited to or do not own, or a tutor profile they cannot view, the Axios API request returns a `403 Forbidden` response.
  * The pages capture this `403` error state via TanStack Query and render a full-screen, clean `<ForbiddenScreen />` component instead of crashing or showing a blank page. Similarly, `404` errors are handled via a custom `<NotFoundScreen />` component.

### 4. Client-Side Upload Constraints (Section D)
* **Allowed Formats & Native Inputs**:
  * File uploads restrict files natively in the browser via file picker configurations (`accept=".pdf,.docx,.png,.jpg,.jpeg"`).
* **Pre-flight Size Checks**:
  * Prior to posting file payloads, the client checks `file.size`. If the file exceeds **5MB** (5,242,880 bytes), the upload is halted immediately and a warning toast is shown. This prevents unnecessary high-bandwidth network usage.

### 5. Tutor Profile & Directory Visibility Policies (Section E)
* **Tutor Browsing Restrictions**:
  * Under Section E authorization rules, tutors are blocked from searching or browsing other tutors.
  * The frontend restricts access to the `/tutors` directory and `/tutors/[id]` detail pages.
  * If a tutor attempts to load these routes directly, the client-side middleware or profile controllers redirect them back to the cases search dashboard, rendering a warning message.

---

## 2. Prerequisites & Environment Variables

Create a `.env` file at the root of the `/fe` directory with the following variables:

```ini
# Base REST API endpoint URL matching your backend service
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
```

---

## Seed Data & Credentials

The database comes pre-seeded with a comprehensive set of mock accounts for testing. All accounts share the same password: **`Password123`**.

| Username | Role | Purpose |
|---|---|---|
| `admin` | `ADMIN` | System administrator with full access to cases/profiles |
| `parent1` | `PARENT` | Parent account with cases (P5 Science, Sec 4 Math) |
| `parent2` | `PARENT` | Parent account with cases (JC 2 Chemistry) |
| `parent3` | `PARENT` | Parent account with cases (Empty profile) |
| `tutor1` | `TUTOR` | Mathematics Specialist (NUS BSc) |
| `tutor2` | `TUTOR` | English & Literature Specialist (NTU MA) |
| `tutor3` | `TUTOR` | Computer Science Tutor (SMU) |
| `tutor4` | `TUTOR` | Chemistry Tutor (NUS PhD) |
| `tutor5` | `TUTOR` | Physics Tutor (NUS BSc) |

---

## 3. Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Compiler**:
   Start the Next.js hot-reloaded development compiler:
   ```bash
   npm run dev
   ```
   *The frontend client will be live at `http://localhost:3000`.*

3. **Verify Build Compilation**:
   Run the static generator and TypeScript check to verify compile readiness:
   ```bash
   npm run build
   ```
