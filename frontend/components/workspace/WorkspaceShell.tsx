"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  getCurrentWorkspace,
  getStoredEmail,
} from "@/lib/workspaceApi";
import type { ReactNode } from "react";
import type { Workspace } from "@/lib/workspaceApi";

const contentLinks = [
  { label: "Projects", href: "/workspace/projects" },
  { label: "Blogs", href: "/workspace/blogs" },
  { label: "Services", href: "/workspace/services" },
  { label: "Experience", href: "/workspace/experience" },
  { label: "Skills", href: "/workspace/skills" },
  { label: "Testimonials", href: "/workspace/testimonials" },
  { label: "About", href: "/workspace/about" },
  { label: "Media", href: "/workspace/media" },
];

export default function WorkspaceShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCurrentWorkspace();
        setWorkspace(data);
      } catch {
        clearSession();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [router]);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  if (loading || !workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F5]">
        <div className="text-sm text-[#686862]">
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F5] text-[#111111]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[#E7E7E2] bg-white lg:flex lg:flex-col">
          <div className="border-b border-[#E7E7E2] px-6 py-5">
            <Link
              href="/workspace"
              className="text-xl font-semibold tracking-[-0.04em]"
            >
              Publify
            </Link>
          </div>

          <div className="px-4 py-5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#989890]">
              Workspace
            </p>

            <div className="mt-3 rounded-xl bg-[#F2F5F2] px-3 py-3">
              <p className="truncate text-sm font-semibold">
                {workspace.name}
              </p>

              <p className="mt-1 truncate text-xs text-[#686862]">
                {workspace.slug}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-6">
            <Link
              href="/workspace"
              className={`flex rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                pathname === "/workspace"
                  ? "bg-[#111111] text-white"
                  : "text-[#686862] hover:bg-[#F5F5F1] hover:text-[#111111]"
              }`}
            >
              Overview
            </Link>

            <p className="mt-7 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#989890]">
              Content
            </p>

            <div className="mt-2 space-y-1">
              {contentLinks.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-[#111111] text-white"
                        : "text-[#686862] hover:bg-[#F5F5F1] hover:text-[#111111]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-[#E7E7E2] p-4">
            <div className="mb-3 truncate px-3 text-xs text-[#989890]">
              {getStoredEmail()}
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[#686862] transition hover:bg-[#F5F5F1] hover:text-[#111111]"
            >
              <span>Account</span>
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#E7E7E2] bg-[#F8F8F5]/95 px-5 py-4 backdrop-blur sm:px-8">
            <div>
              <Link
                href="/workspace"
                className="text-lg font-semibold tracking-[-0.03em] lg:hidden"
              >
                Publify
              </Link>

              <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[#157A5B] lg:block">
                {workspace.name}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-[#DADAD4] bg-white px-4 py-2 text-sm font-medium transition hover:border-[#BDBDB5] lg:hidden"
            >
              Sign out
            </button>
          </header>

          <div className="border-b border-[#E7E7E2] bg-white px-5 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              <Link
                href="/workspace"
                className="shrink-0 rounded-lg border border-[#E1E1DB] px-3 py-2 text-xs font-medium"
              >
                Overview
              </Link>

              {contentLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-lg border border-[#E1E1DB] px-3 py-2 text-xs font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>{children}</div>
        </section>
      </div>
    </main>
  );
}
