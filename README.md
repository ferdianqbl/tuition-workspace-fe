# Tuition Case Workspace - Frontend Application

This is the Next.js React frontend client for the Tuition Case Workspace platform, built using React, Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 🌐 Live Deployments & Repositories

- **Frontend Client Web App**: [Live Deployment (Vercel)](https://tuition-workspace-fe.vercel.app/) | [GitHub Repository](https://github.com/ferdianqbl/tuition-workspace-fe)
- **Backend API Gateway**: [Live API Swagger Docs (Vercel)](https://tuition-workspace-api.vercel.app/api/docs) | [GitHub Repository](https://github.com/ferdianqbl/tuition-workspace-api)

---

## 📄 Documentation Index

### Frontend Documentation (Local Relative Links)
- **Master Plan & Routing**: Read about Next.js page maps and paths in [plans/PLANNING.md](./plans/PLANNING.md).
- **System Architecture**: Read about the Axios interceptors, caching layers, and folder maps in [plans/SYSTEM_ARCHITECTURE.md](./plans/SYSTEM_ARCHITECTURE.md).
- **UI/UX Design System**: Read about colors, typography, roundings, and styled primitives in [plans/DESIGN.md](./plans/DESIGN.md).

### Connected Backend Documentation (GitHub Absolute Links)
- **Backend System Architecture**: Read about Express middleware configurations and Supabase/Prisma pooling in [be/plans/SYSTEM_ARCHITECTURE.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/SYSTEM_ARCHITECTURE.md).
- **Backend API Specs**: Read about endpoint paths, payloads, and response interfaces in [be/plans/API.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/API.md).
- **Backend Master Plan**: Read about planning roadmaps and the database ERD in [be/plans/PLANNING.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/PLANNING.md).

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
