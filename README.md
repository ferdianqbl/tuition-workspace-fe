# Tuition Case Workspace - Frontend Application

This is the Next.js React frontend client for the Tuition Case Workspace platform, built using React, Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 1. Documentation Index

- Detailed Next.js directory design and routing maps: [plans/PLANNING.md](./plans/PLANNING.md)
- Styling tokens, roundings, and custom theme specification: [plans/DESIGN.md](./plans/DESIGN.md)

---

## 2. Prerequisites & Environment Variables

Create a `.env` file at the root of the `/fe` directory with the following variables:

```ini
# Base REST API endpoint URL matching your backend service
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
```

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
