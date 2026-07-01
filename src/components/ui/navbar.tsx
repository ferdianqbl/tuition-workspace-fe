"use client";

import { useGetMe } from "@/services/auth/get-me.service";
import { useLogout } from "@/services/auth/logout.service";
import { EUserRole } from "@/types/user.type";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, LogOut, Briefcase, Users, User, LayoutDashboard, Menu, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isGlobalLoading = isFetching > 0 || isMutating > 0;

  const { data: meData } = useGetMe();

  const logoutMutation = useLogout({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const user = meData?.data;

  if (!user) return null;

  const isParent = user.role === EUserRole.PARENT;
  const isTutor = user.role === EUserRole.TUTOR;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Tutor Directory",
      href: "/tutors",
      icon: Users,
      show: isParent || user.role === EUserRole.ADMIN,
    },
    {
      name: "Tuition Cases",
      href: "/cases",
      icon: Briefcase,
      show: true,
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: User,
      show: isTutor,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate(undefined);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                Tuition Case Workspace
              </span>
            </Link>
            {isGlobalLoading && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-wider animate-pulse">
                <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0" />
                Syncing
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white border border-neutral-800"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.name}
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
                {user.role}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="icon"
              className="rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all hover:bg-neutral-850"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[11px] font-bold text-white">{user.name}</span>
              <span className="text-[9px] text-indigo-400 font-medium tracking-wider uppercase">
                {user.role}
              </span>
            </div>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="outline"
              size="icon"
              className="rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-2 pb-4 space-y-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white border border-neutral-800"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          <Button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Keluar (Logout)
          </Button>
        </div>
      )}
    </nav>
  );
}
