"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceAuthShell from "@/components/WorkspaceAuthShell";
import { getAccessToken, register } from "@/lib/workspaceApi";

export default function RegisterPage() {
  const router = useRouter();

  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/workspace");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        email.trim(),
        password,
        workspaceName.trim()
      );

      router.replace("/workspace");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create workspace"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspaceAuthShell
      mode="register"
      title="Create your workspace"
      description="Start with a workspace name, then build your publishing system around it."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="workspaceName"
            className="mb-2 block text-sm font-medium"
          >
            Workspace name
          </label>

          <input
            id="workspaceName"
            type="text"
            autoComplete="organization"
            minLength={2}
            required
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            placeholder="Acme Studio"
            className="h-12 w-full rounded-xl border border-[#DADAD4] bg-white px-4 text-sm outline-none transition placeholder:text-[#A4A49D] focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Work email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="h-12 w-full rounded-xl border border-[#DADAD4] bg-white px-4 text-sm outline-none transition placeholder:text-[#A4A49D] focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="h-12 w-full rounded-xl border border-[#DADAD4] bg-white px-4 text-sm outline-none transition placeholder:text-[#A4A49D] focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#111111] px-5 text-sm font-semibold text-white transition hover:bg-[#242420] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating workspace..." : "Create workspace"}
        </button>

        <p className="text-center text-sm text-[#686862]">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#157A5B] hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </WorkspaceAuthShell>
  );
}
