"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceAuthShell from "@/components/WorkspaceAuthShell";
import { getAccessToken, login } from "@/lib/workspaceApi";

export default function LoginPage() {
  const router = useRouter();

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
      await login(email.trim(), password);
      router.replace("/workspace");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspaceAuthShell
      mode="login"
      title="Sign in to Publify"
      description="Access your workspace and continue managing your publishing workflow."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-[#686862]">
          New to Publify?{" "}
          <a
            href="/register"
            className="font-semibold text-[#157A5B] hover:underline"
          >
            Create your workspace
          </a>
        </p>
      </form>
    </WorkspaceAuthShell>
  );
}
