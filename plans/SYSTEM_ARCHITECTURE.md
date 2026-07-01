# System Architecture & Directory Structure - Frontend Application

This document defines the architectural pipeline, folder layout, state caching strategy, and authentication data flow for the frontend client.

---

## 1. Frontend System Architecture

The frontend is built as a single-page application (SPA) using React and Next.js (App Router):

```
                     ┌───────────────────────────────────┐
                     │         Browser (Client)          │
                     └─────────────────┬─────────────────┘
                                       │
                         [Axios Request Interceptor]
                                       │  (Attaches Bearer Token)
                                       ▼
                     ┌───────────────────────────────────┐
                     │          API Gateway (BE)         │
                     └─────────────────┬─────────────────┘
                                       │
                        [Axios Response Interceptor]
                                       │  (Auto-logout on 401 response)
                                       ▼
                     ┌───────────────────────────────────┐
                     │        TanStack Query Cache       │
                     └───────────────────────────────────┘
```

### Caching and Data Fetching
- **Server Cache Layer**: Powered by TanStack React Query. It caches query responses (e.g. cases directory, tutor public profiles) in memory and automatically refreshes them in the background (stale-while-revalidate pattern).
- **Mutation Invalidation**: Whenever a mutation occurs (like uploading a credential document or updating a case status), React Query automatically invalidates the related cache keys, prompting the browser to fetch fresh, up-to-date information.

### Authentication Data Flow
- **Session Tokens**: Active sessions are validated via a secure JWT session token set by the backend strictly as an `HttpOnly` cookie.
- **Credentials Matching**: Axios is configured with `withCredentials: true` globally so that cookies are natively handled and passed by the browser with all outbound requests, entirely avoiding JavaScript read access or local storage.
- **Response Interceptor**: An interceptor watches for `401 Unauthorized` responses. If the session token cookie expires, the interceptor automatically redirects the user back to the login page (`/`) to enforce fresh sessions.

---

## 2. Directory & Folder Structure

The frontend isolates layout configurations, pages, and components using a feature-based structure:

```
fe/
├── plans/                     # Architectural specs, design tokens, and routing maps
├── public/                    # Static assets (images, vectors, favicons)
└── src/
    ├── app/                   # Next.js App Router route entrypoints and layout pages
    ├── components/            # React UI components (split into layers):
    │   ├── ui/                # Translucent primitives mapped to Shadcn UI primitive blocks (Button, Card, Input)
    │   ├── shared/            # Reusable page components (e.g. Navigation Header, Layout Guards, Page Loaders)
    │   └── features/          # Feature-specific pages and layouts (auth/, cases/, tutors/, profile/)
    ├── hooks/                 # Reusable custom React hooks
    ├── lib/                   # Network configurations (Axios clients, React Query defaults)
    ├── providers/             # Global contexts and wrappers (TanStack Query, theme wrappers)
    ├── services/              # API fetch functions using Axios, matching backend module endpoints
    ├── types/                 # TypeScript interfaces and type declarations
    └── utils/                 # General pure utility helper functions
```

---

## 🔗 Cross-Repository References

- **Backend Repository**: [tuition-workspace-api](https://github.com/ferdianqbl/tuition-workspace-api)
- **Backend System Architecture**: [plans/SYSTEM_ARCHITECTURE.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/SYSTEM_ARCHITECTURE.md)
- **Backend API Specs**: [plans/API.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/API.md)
- **Backend Master Plan & ERD**: [plans/PLANNING.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/PLANNING.md)
- **Live Swagger API Docs**: [Live API Swagger Docs (Vercel)](https://tuition-workspace-api.vercel.app/api/docs)
