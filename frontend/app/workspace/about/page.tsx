"use client";

import { FormEvent, useEffect, useState } from "react";
import { authFetch } from "@/lib/workspaceApi";

type AboutData = {
  id?: number;
  headline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  avatarMediaUrl: string;
};

const emptyAbout: AboutData = {
  headline: "",
  bio: "",
  location: "",
  email: "",
  resumeUrl: "",
  avatarMediaUrl: "",
};

export default function WorkspaceAboutPage() {
  const [form, setForm] = useState<AboutData>(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("/workspace/about");

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load About content");
      }

      const data = await response.json();

      setForm({
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        email: data.email || "",
        resumeUrl: data.resumeUrl || "",
        avatarMediaUrl: data.avatarMediaUrl || "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load About content"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(name: keyof AboutData, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await authFetch("/workspace/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save About content");
      }

      setMessage("About content saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save About content"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#E7E7E2] bg-white p-8 text-sm text-[#686862]">
          Loading About content...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="border-b border-[#E1E1DB] pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#157A5B]">
          Content
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          About
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#686862]">
          Manage the main About content for your workspace.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-xl border border-[#BBD8C8] bg-[#F0F8F2] px-4 py-3 text-sm text-[#157A5B]">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={save}
        className="mt-6 rounded-2xl border border-[#E1E1DB] bg-white p-6 shadow-[0_16px_40px_rgba(17,17,17,0.04)] sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Headline
            </label>

            <input
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              className="h-12 w-full rounded-xl border border-[#DADAD4] px-4 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="h-12 w-full rounded-xl border border-[#DADAD4] px-4 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="h-12 w-full rounded-xl border border-[#DADAD4] px-4 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Resume URL
            </label>

            <input
              value={form.resumeUrl}
              onChange={(e) => update("resumeUrl", e.target.value)}
              className="h-12 w-full rounded-xl border border-[#DADAD4] px-4 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-[#DADAD4] px-4 py-3 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Avatar media URL
            </label>

            <input
              value={form.avatarMediaUrl}
              onChange={(e) =>
                update("avatarMediaUrl", e.target.value)
              }
              className="h-12 w-full rounded-xl border border-[#DADAD4] px-4 text-sm outline-none focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-[#E7E7E2] pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save About"}
          </button>
        </div>
      </form>
    </div>
  );
}
