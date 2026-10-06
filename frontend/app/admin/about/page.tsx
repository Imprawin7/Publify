"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserRound,
  MapPin,
  Mail,
  FileText,
  Image as ImageIcon,
  Link2,
} from "lucide-react";
import { authFetch } from "@/lib/adminApi";
import type { About } from "@/lib/types";

export default function AdminAboutPage() {
  const [form, setForm] = useState<About>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    setLoading(true);
    setStatus("idle");

    try {
      const res = await authFetch("/about");

      if (!res.ok) {
        throw new Error("Failed to load About content.");
      }

      const data = await res.json();
      setForm(data || {});
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load About content."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(key: keyof About, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await authFetch("/about", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(
          body.error || "Failed to save About content."
        );
      }

      const updated = await res.json().catch(() => form);

      setForm(updated || form);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save About content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="publify-content-loading">
        <Loader2
          size={22}
          className="resource-spinner"
        />
        <span>Loading About content...</span>
      </div>
    );
  }

  return (
    <div className="publify-about-editor">
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">
            CONTENT
          </span>

          <h1>About</h1>

          <p>
            Manage your profile information and the content
            displayed across your public website.
          </p>
        </div>

        <button
          className="publify-primary-button about-save-button"
          onClick={save}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2
                size={16}
                className="resource-spinner"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save changes
            </>
          )}
        </button>
      </div>

      {status === "saved" && (
        <div className="publify-about-notice success">
          <CheckCircle2 size={17} />

          <div>
            <strong>Changes saved</strong>
            <span>
              Your About content has been updated successfully.
            </span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="publify-about-notice error">
          <AlertCircle size={17} />

          <div>
            <strong>Unable to save changes</strong>
            <span>
              {errorMessage || "Please try again."}
            </span>
          </div>
        </div>
      )}

      <div className="publify-about-grid">
        <section className="publify-editor-card">
          <div className="publify-editor-card-header">
            <div className="publify-editor-icon">
              <UserRound size={18} />
            </div>

            <div>
              <h2>Profile introduction</h2>
              <p>
                The main introduction shown on your website.
              </p>
            </div>
          </div>

          <div className="publify-editor-card-body">
            <div className="publify-editor-field full">
              <label htmlFor="headline">
                Headline
              </label>

              <input
                id="headline"
                type="text"
                value={form.headline || ""}
                onChange={(e) =>
                  updateField(
                    "headline",
                    e.target.value
                  )
                }
                placeholder="Software Developer"
              />

              <span className="publify-field-hint">
                Keep this short and clear. It can be used as
                your primary profile heading.
              </span>
            </div>

            <div className="publify-editor-field full">
              <label htmlFor="bio">
                Biography
              </label>

              <textarea
                id="bio"
                rows={10}
                value={form.bio || ""}
                onChange={(e) =>
                  updateField(
                    "bio",
                    e.target.value
                  )
                }
                placeholder="Write a short professional introduction..."
              />

              <span className="publify-field-hint">
                A concise professional summary works best for
                the homepage and About page.
              </span>
            </div>
          </div>
        </section>

        <section className="publify-editor-card">
          <div className="publify-editor-card-header">
            <div className="publify-editor-icon">
              <MapPin size={18} />
            </div>

            <div>
              <h2>Contact information</h2>
              <p>
                Basic information visitors can use to reach you.
              </p>
            </div>
          </div>

          <div className="publify-editor-card-body">
            <div className="publify-editor-field">
              <label htmlFor="location">
                Location
              </label>

              <div className="publify-input-with-icon">
                <MapPin size={16} />

                <input
                  id="location"
                  type="text"
                  value={form.location || ""}
                  onChange={(e) =>
                    updateField(
                      "location",
                      e.target.value
                    )
                  }
                  placeholder="Jaipur, India"
                />
              </div>
            </div>

            <div className="publify-editor-field">
              <label htmlFor="email">
                Email
              </label>

              <div className="publify-input-with-icon">
                <Mail size={16} />

                <input
                  id="email"
                  type="email"
                  value={form.email || ""}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="publify-editor-card">
          <div className="publify-editor-card-header">
            <div className="publify-editor-icon">
              <FileText size={18} />
            </div>

            <div>
              <h2>Resume</h2>
              <p>
                Link to the resume visitors can access.
              </p>
            </div>
          </div>

          <div className="publify-editor-card-body">
            <div className="publify-editor-field full">
              <label htmlFor="resumeUrl">
                Resume URL
              </label>

              <div className="publify-input-with-icon">
                <Link2 size={16} />

                <input
                  id="resumeUrl"
                  type="url"
                  value={form.resumeUrl || ""}
                  onChange={(e) =>
                    updateField(
                      "resumeUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/resume.pdf"
                />
              </div>

              <span className="publify-field-hint">
                Use a publicly accessible PDF or document URL.
              </span>
            </div>
          </div>
        </section>

        <section className="publify-editor-card">
          <div className="publify-editor-card-header">
            <div className="publify-editor-icon">
              <ImageIcon size={18} />
            </div>

            <div>
              <h2>Profile image</h2>
              <p>
                Image used for your public profile.
              </p>
            </div>
          </div>

          <div className="publify-editor-card-body">
            <div className="publify-avatar-preview">
              <div className="publify-avatar-image">
                {form.avatarMediaUrl ? (
                  <img
                    src={form.avatarMediaUrl}
                    alt="Profile preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <UserRound size={26} />
                )}
              </div>

              <div>
                <strong>
                  Profile image preview
                </strong>

                <span>
                  Enter an image URL below to preview it.
                </span>
              </div>
            </div>

            <div className="publify-editor-field full">
              <label htmlFor="avatarMediaUrl">
                Avatar image URL
              </label>

              <div className="publify-input-with-icon">
                <ImageIcon size={16} />

                <input
                  id="avatarMediaUrl"
                  type="url"
                  value={form.avatarMediaUrl || ""}
                  onChange={(e) =>
                    updateField(
                      "avatarMediaUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <span className="publify-field-hint">
                Media Library integration will be added later
                so you can select uploaded images directly.
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="publify-editor-bottom">
        <div>
          <span>Publify CMS</span>
          <p>
            Changes are saved directly to your content API.
          </p>
        </div>

        <button
          className="publify-primary-button"
          onClick={save}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2
                size={16}
                className="resource-spinner"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}