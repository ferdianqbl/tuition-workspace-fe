# Frontend Verification & Validation Results - Tuition Case Workspace

This document verifies and validates that the frontend React client complies with all functional and security requirements defined in the technical test specification.

---

## 1. Requirement Traceability Matrix

Here is how the Next.js App Router frontend implements each section of the technical test:

### A. Users, Auth, and Sessions
* **Login/Logout Navigation**: Handled inside `<AuthPage />` with visual Register and Login tabs. Clicking "Logout" fires an API call to flush cookies and triggers local query cache invalidation.
* **Session Expiry Handling**: An Axios response interceptor monitors all responses. If any query returns a `401 Unauthorized` status (due to token expiration), the client immediately redirects to the `/` root page and flushes credentials.
* **Credentials Hashing**: Passed to the backend. The frontend prevents client-side leaks of plain passwords.

### B. Tuition Cases Directory
* **Creation Form**: `<CreateCaseDialog />` provides a type-safe form using `react-hook-form` to capture title, subject, level, location, and budget.
* **Browse Directory**: Paginated directory utilizing TanStack React Query `keepPreviousData: true` for smooth transitions. Includes live input filters for `subject`, `level`, and `status`.
* **Keyword Search**: Uses a debounced input search handler triggering search queries towards the backend.

### C. Row-Level Access Controls
* **UI Reflections**:
  - Tutors are presented with a restricted "Invited Cases" list and cannot see the "All Tutors Directory".
  - Parents are shown case owner tools (e.g. "Invite Tutor" search controls and access list selectors) that are completely hidden from tutor accounts.
  - Buttons like "Upload Document" are hidden/disabled unless permissions are verified.
* **Tutor Directory Restriction**: Tutors are blocked from searching or viewing other tutors' profiles. The frontend navbar hides `/tutors` paths for tutors, and any manual access to `/tutors` routes triggers the Layout Guard to render a clean, branded `<ForbiddenScreen />`.
* **Graceful Refusal (403/401)**: If a user attempts to manually bypass routes or fetches fail, layout guards intercept the responses and render a clean, branded `<ForbiddenScreen />` or `<NotFoundScreen />` rather than a blank page or blank layout crash.

### D. Secure Document Workspace
* **Upload constraints**: React file input restricts files via `accept=".pdf,.docx,.png,.jpg,.jpeg"`.
* **Vercel Writeable Storage (/tmp)**: Adapts to Vercel's read-only file systems by utilizing the backend's `/tmp` redirect utility for temporary file streams, ensuring uploads succeed in serverless container runs.
* **Upload/Download checks**: Uses Axios multipart requests. File download triggers a query that reads the secure stream, catching and displaying custom permission warnings if the backend revokes access.

### E. Tutor Profiles
* **Tutor Self-Management**: `<ProfilePage />` enables tutors to configure their public display name, qualifications list, and experience milestones.
* **Parent Search Directory**: Paginated profile cards containing query filters so parents can browse available tutors and select candidate details.

---

## 2. Build & Compilation Verification

We verified the frontend codebase compiles cleanly:

```bash
# Executing compilation check
npm run build
```

* **TypeScript Compilation**: **Passed**. All schemas and query types resolve without type violations.
* **Next.js Route Generator**: **Passed**. Generates static and dynamic pages with the following structure:
  - `○ /` (Static login/registration landing page)
  - `○ /_not-found` (Static 404 page)
  - `○ /cases` (Static cases index page)
  - `ƒ /cases/[id]` (Dynamic server-rendered case workspace)
  - `○ /dashboard` (Static user landing dashboard)
  - `○ /profile` (Static tutor settings panel)
  - `○ /tutors` (Static tutor directory list)
  - `ƒ /tutors/[id]` (Dynamic server-rendered tutor detail)
* **Tailwind CSS Compilation**: **Passed**. Styles compile cleanly.

---

## 🔗 Cross-Repository References

- **Backend Repository**: [tuition-workspace-api](https://github.com/ferdianqbl/tuition-workspace-api)
- **Backend Validation Document**: [plans/VALIDATION.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/VALIDATION.md)
- **Frontend Repository**: [tuition-workspace-fe](https://github.com/ferdianqbl/tuition-workspace-fe)
- **Live Frontend Web App**: [Live Deployment (Vercel)](https://tuition-workspace-fe.vercel.app/)
