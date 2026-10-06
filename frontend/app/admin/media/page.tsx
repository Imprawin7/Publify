"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Search,
  Copy,
  Check,
  Image as ImageIcon,
  FileImage,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { authFetch, API_BASE } from "@/lib/adminApi";
import type { Media } from "@/lib/types";

export default function AdminMediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const res = await authFetch("/media/library");

      if (!res.ok) {
        throw new Error("Failed to load media library.");
      }

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load media library."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch("/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed. Please try again.");
      }

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      await uploadFile(file);
    }

    e.target.value = "";
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      await uploadFile(file);
    }
  }

  async function copyUrl(item: Media) {
    const fullUrl = `${API_BASE}${item.url}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      setError("Unable to copy URL.");
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      [
        item.filename,
        item.mimeType,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }, [items, search]);

  function formatSize(bytes?: number) {
    if (!bytes) return "—";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(value?: string) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="publify-media-page">
      <div className="publify-page-header publify-media-header">
        <div>
          <span className="publify-page-eyebrow">ASSETS</span>
          <h1>Media Library</h1>
          <p>
            Upload and manage images used across your public website.
          </p>
        </div>

        <button
          type="button"
          className="publify-primary-button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="publify-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload image
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          hidden
          disabled={uploading}
        />
      </div>

      <div
        className={`publify-media-dropzone ${
          dragActive ? "publify-media-dropzone-active" : ""
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading) {
            inputRef.current?.click();
          }
        }}
      >
        <div className="publify-media-upload-icon">
          {uploading ? (
            <Loader2 size={22} className="publify-spin" />
          ) : (
            <Upload size={22} />
          )}
        </div>

        <div>
          <strong>
            {uploading
              ? "Uploading image..."
              : "Drop an image here or click to browse"}
          </strong>
          <span>PNG, JPG, JPEG, WEBP or GIF · Maximum 10 MB</span>
        </div>
      </div>

      {error && (
        <div className="publify-media-error">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className="publify-media-toolbar">
        <div className="publify-media-toolbar-left">
          <div className="publify-media-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <span className="publify-media-count">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <button
          type="button"
          className="publify-media-refresh"
          onClick={refresh}
          disabled={loading}
          title="Refresh library"
        >
          <RefreshCw
            size={15}
            className={loading ? "publify-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="publify-content-loading">
          <div className="publify-loading-card">
            <Loader2 size={20} className="publify-spin" />
            <span>Loading media library...</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="publify-media-empty">
          <div className="publify-media-empty-icon">
            <FileImage size={26} />
          </div>

          <h3>{search ? "No media found" : "Your media library is empty"}</h3>

          <p>
            {search
              ? "Try a different filename or search term."
              : "Upload your first image to use it across your portfolio."}
          </p>

          {!search && (
            <button
              type="button"
              className="publify-secondary-button"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={15} />
              Upload image
            </button>
          )}
        </div>
      ) : (
        <div className="publify-media-grid">
          {filteredItems.map((item) => {
            const imageUrl = `${API_BASE}${item.url}`;

            return (
              <article
                key={item.id}
                className="publify-media-card"
              >
                <button
                  type="button"
                  className="publify-media-preview"
                  onClick={() => setSelected(item)}
                  title="View media details"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={item.filename}
                  />

                  <span className="publify-media-preview-overlay">
                    <ExternalLink size={17} />
                  </span>
                </button>

                <div className="publify-media-card-body">
                  <div className="publify-media-file-icon">
                    <ImageIcon size={15} />
                  </div>

                  <div className="publify-media-file-info">
                    <strong title={item.filename}>
                      {item.filename}
                    </strong>

                    <span>
                      {item.mimeType || "Image"} ·{" "}
                      {formatSize(item.sizeBytes)}
                    </span>
                  </div>
                </div>

                <div className="publify-media-card-footer">
                  <span>{formatDate(item.uploadedAt)}</span>

                  <button
                    type="button"
                    className="publify-media-copy"
                    onClick={() => copyUrl(item)}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={13} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="publify-media-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="publify-media-modal">
            <div className="publify-media-modal-header">
              <div>
                <span className="publify-page-eyebrow">MEDIA</span>
                <h2>Image details</h2>
              </div>

              <button
                type="button"
                className="publify-icon-button"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="publify-media-modal-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${API_BASE}${selected.url}`}
                alt={selected.filename}
              />
            </div>

            <div className="publify-media-details">
              <div>
                <span>Filename</span>
                <strong>{selected.filename}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{selected.mimeType || "Image"}</strong>
              </div>

              <div>
                <span>Size</span>
                <strong>{formatSize(selected.sizeBytes)}</strong>
              </div>

              <div>
                <span>Uploaded</span>
                <strong>{formatDate(selected.uploadedAt)}</strong>
              </div>
            </div>

            <div className="publify-media-url">
              <span>Media URL</span>

              <div>
                <input
                  value={`${API_BASE}${selected.url}`}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                />

                <button
                  type="button"
                  onClick={() => copyUrl(selected)}
                >
                  {copiedId === selected.id ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>
            </div>

            <div className="publify-media-modal-footer">
              <button
                type="button"
                className="publify-secondary-button"
                onClick={() => setSelected(null)}
              >
                Close
              </button>

              <a
                href={`${API_BASE}${selected.url}`}
                target="_blank"
                rel="noreferrer"
                className="publify-primary-button"
              >
                <ExternalLink size={15} />
                Open image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}