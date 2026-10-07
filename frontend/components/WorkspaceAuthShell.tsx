"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function WorkspaceAuthShell({
  title,
  description,
  children,
  mode,
}: {
  title: string;
  description: string;
  children: ReactNode;
  mode: "login" | "register";
}) {
  return (
    <main className="min-h-screen bg-[#F8F8F5] text-[#111111]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
          >
            Publify
          </Link>

          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="text-sm font-medium text-[#686862] transition hover:text-[#111111]"
          >
            {mode === "login"
              ? "Create an account"
              : "Already have an account?"}
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1fr_460px] lg:gap-24">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center rounded-full border border-[#DCDCD6] bg-white px-3 py-1.5 text-xs font-medium text-[#157A5B]">
                Publify Workspace
              </div>

              <h1 className="text-6xl font-semibold leading-[0.98] tracking-[-0.06em]">
                Your publishing
                <br />
                starts here.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-[#686862]">
                {mode === "login"
                  ? "Sign in to manage your content, collaborate with your team, and publish from one focused workspace."
                  : "Create a dedicated workspace for your content, team, and publishing workflow."}
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                {[
                  "Structured content",
                  "Team collaboration",
                  "Media management",
                  "Publishing workflow",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#E7E7E2] bg-white px-4 py-4 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="rounded-2xl border border-[#E1E1DB] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#157A5B]">
                  {mode === "login" ? "Welcome back" : "Get started"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686862]">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
