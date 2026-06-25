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
- **Session Tokens**: Active sessions are validated via a JWT token. This token is returned in the JSON payload of a successful login request.
- **Request Interceptor**: An Axios interceptor retrieves the token from `localStorage` and appends it to the `Authorization` header as `Bearer <token>` on all outbound requests.
- **Response Interceptor**: Another interceptor watches for `401 Unauthorized` responses. If a session token expires, the interceptor clears `localStorage` and instantly redirects the user to the log-in page to prevent invalid state calls.

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
