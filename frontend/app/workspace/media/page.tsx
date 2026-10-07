"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { authFetch } from "@/lib/workspaceApi";

type MediaItem = {
  id: number;
  filename: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedAt?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function getAssetUrl(url: string) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return API_BASE + (url.startsWith("/") ? url : "/" + url);
}

export default function WorkspaceMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("/workspace/media");

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load media");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load media"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authFetch("/workspace/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }

      setMessage("Media uploaded successfully.");
      await load();
      event.target.value = "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-5 border-b border-[#E1E1DB] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#157A5B]">
            Content
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Media
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#686862]">
            Upload and manage images and other publishing assets.
          </p>
        </div>

        <label className="cursor-pointer rounded-xl bg-[#111111] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#252521]">
          {uploading ? "Uploading..." : "Upload media"}

          <input
            type="file"
            className="hidden"
            onChange={upload}
            disabled={uploading}
          />
        </label>
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

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-[#E7E7E2] bg-white p-8 text-sm text-[#686862]">
            Loading media...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8D8D1] bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              No media yet
            </h2>

            <p className="mt-2 text-sm text-[#686862]">
              Upload your first asset to this workspace.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const assetUrl = getAssetUrl(item.url);

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#E7E7E2] bg-white"
                >
                  <div className="aspect-[16/10] bg-[#F3F3EF]">
                    {item.mimeType?.startsWith("image/") ? (
                      <img
                        src={assetUrl}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-medium text-[#686862]">
                        FILE
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="truncate text-sm font-semibold">
                      {item.filename}
                    </p>

                    <p className="mt-1 text-xs text-[#989890]">
                      {item.mimeType || "Unknown type"}
                    </p>

                    <a
                      href={assetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-[#157A5B] hover:underline"
                    >
                      Open asset →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
