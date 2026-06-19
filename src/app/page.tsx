import { 
  Check, 
  Code, 
  Cpu, 
  Database, 
  ExternalLink, 
  Layers, 
  Sparkles 
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Enoram
            </span>
            <span className="text-xs text-indigo-400 block -mt-1 font-medium tracking-widest uppercase">
              Starter
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Environment Ready
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl px-6 py-12 flex-1 flex flex-col justify-center z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-6">
            Next.js Starter <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Activated</span>
          </h1>
          <p className="text-neutral-400 text-lg sm:text-xl leading-relaxed">
            Your customized, premium Next.js 16 frontend starter template is configured and ready. Start building utilizing global state, cached server fetches, and modular structure.
          </p>
        </div>

        {/* Core Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { name: "Next.js 16", desc: "App Router & React 19 Compiler" },
            { name: "Tailwind v4", desc: "Modern CSS-first Architecture" },
            { name: "TanStack Query", desc: "Cached & Auto-Sync API State" },
            { name: "Zustand Store", desc: "Lightweight Client State" }
          ].map((tech) => (
            <div key={tech.name} className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900/50 to-neutral-900 border border-neutral-800 backdrop-blur-sm transition-all hover:translate-y-[-2px]">
              <h3 className="font-bold text-white text-lg">{tech.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>

        {/* Architectural Features Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Directory Setup */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                  Modular Folder Layout
                </span>
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Workspace Directories</h2>
              <p className="text-neutral-400 text-sm mb-6">
                Folders are pre-configured to ensure clean separations of concerns. Write scalable frontend code immediately:
              </p>

              <div className="space-y-3 p-6 bg-neutral-950/80 border border-neutral-800/50 rounded-2xl">
                {[
                  { path: "public/", desc: "Static assets (images, fonts, favicon)" },
                  { path: "src/app/", desc: "Routing page components and layouts" },
                  { path: "src/components/features/", desc: "Feature-scoped business logic panels" },
                  { path: "src/lib/", desc: "Library settings (Axios, React Query)" },
                  { path: "src/services/", desc: "API requests and React Query hook files" },
                  { path: "src/types/", desc: "Centralized Interfaces, Types and Enums" }
                ].map((item) => (
                  <div key={item.path} className="flex justify-between items-center text-xs border-b border-neutral-900/80 pb-2 last:border-0 last:pb-0">
                    <span className="font-mono text-indigo-400">{item.path}</span>
                    <span className="text-neutral-400 text-right">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Initial Setup Verification */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md">
                  Active Integrations
                </span>
                <Database className="w-5 h-5 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Boilerplate Features</h2>
              <p className="text-neutral-400 text-sm mb-6">
                No extra setup needed. The following core integrations are wired up and running out-of-the-box:
              </p>

              <div className="p-6 bg-neutral-950/80 border border-neutral-800/50 rounded-2xl min-h-[160px] flex flex-col justify-center">
                <ul className="space-y-3">
                  {[
                    "Tanstack Query (React Query v5) client mounted in root Providers wrapper",
                    "Axios instance set with JWT interceptor matching NEXT_PUBLIC_API_BASE_URL",
                    "Tailwind CSS v4 import pipeline and css-variable theme tokens loaded",
                    "TypeScript paths alias (@/*) matching src directory alias configured"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Naming Rules and File Structure Guidelines */}
        <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/50 backdrop-blur-lg mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-5 h-5 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Naming & Coding Conventions</h2>
          </div>
          <p className="text-neutral-400 text-sm mb-6">
            This boilerplate template enforces strict coding standards. Verify these guidelines prior to writing code:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-950/50 border border-neutral-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">File Naming</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All files must be in <code className="text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded font-mono">kebab-case</code> without exception. Suffix files by role: <code className="text-indigo-300 font-mono">*.service.ts</code>, <code className="text-indigo-300 font-mono">*.store.ts</code>, <code className="text-indigo-300 font-mono">*.type.ts</code>, <code className="text-indigo-300 font-mono">*.hook.ts</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/50 border border-neutral-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">TypeScript Prefixing</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Interfaces prefix with <code className="text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded font-mono">I</code> (e.g. <code className="text-purple-300 font-mono">IUser</code>). Types prefix with <code className="text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded font-mono">T</code> (e.g. <code className="text-purple-300 font-mono">TUser</code>). Enums prefix with <code className="text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded font-mono">E</code> (e.g. <code className="text-purple-300 font-mono">EUserRole</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/50 border border-neutral-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">Service Functions</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                API services must end with a <code className="text-pink-300 bg-pink-500/10 px-1 py-0.5 rounded font-mono">Service</code> suffix (e.g. <code className="text-pink-300 font-mono">GetAllUserService</code>, <code className="text-pink-300 font-mono">AddUserService</code>). Avoid repeating domain names in file names (e.g. <code className="text-pink-300 font-mono">user/add.service.ts</code>).
              </p>
            </div>
          </div>
        </div>

        {/* Code Scaffolding Commands */}
        <div className="border border-neutral-900 bg-neutral-900/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Project Starter Skill</h3>
              <p className="text-neutral-400 text-sm mt-1 max-w-xl">
                The folder guidelines and configuration code are documented in the skill definitions folder inside Enoram. Read it to review standard patterns.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 shrink-0">
            python3 skills/nextjs-starter-creator/scripts/scaffold.py --output ../new-app --name new-app
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-6 py-8 border-t border-white/5 text-center text-neutral-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <span>© {new Date().getFullYear()} Enoram Starter Dashboard Starter. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-neutral-300 flex items-center gap-1">
            Docs <ExternalLink className="w-3 h-3" />
          </a>
          <a href="#" className="hover:text-neutral-300 flex items-center gap-1">
            Support <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
