"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  GripVertical,
} from "lucide-react";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/adminApi";
import type { Experience } from "@/lib/types";

type ExperienceForm = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  sortOrder: number;
};

const emptyForm: ExperienceForm = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
  sortOrder: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<
    number | "new" | null
  >(null);
  const [form, setForm] =
    useState<ExperienceForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadExperience() {
    setLoading(true);

    try {
      const data =
        await listResource<Experience>("/experience");

      setItems(
        [...data].sort(
          (a, b) =>
            (a.sortOrder ?? 0) -
            (b.sortOrder ?? 0)
        )
      );

      setError("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load experience."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperience();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      [
        item.title,
        item.organization,
        item.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [items, search]);

  const currentCount = items.filter(
    (item) => !item.endDate
  ).length;

  function startNew() {
    setEditingId("new");

    setForm({
      ...emptyForm,
      sortOrder: items.length,
    });

    setError("");
  }

  function startEdit(item: Experience) {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      organization:
        item.organization || "",
      startDate: item.startDate
        ? String(item.startDate).slice(0, 10)
        : "",
      endDate: item.endDate
        ? String(item.endDate).slice(0, 10)
        : "",
      description:
        item.description || "",
      sortOrder: item.sortOrder ?? 0,
    });

    setError("");
  }

  function closeEditor() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof ExperienceForm>(
    key: K,
    value: ExperienceForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveExperience() {
    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.organization.trim()) {
      setError("Organization is required.");
      return;
    }

    if (!form.startDate) {
      setError("Start date is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      startDate: form.startDate,
      endDate: form.endDate || null,
      description:
        form.description.trim(),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId === "new") {
        await createResource<Experience>(
          "/experience",
          payload
        );
      } else {
        await updateResource<Experience>(
          "/experience",
          editingId as number,
          payload
        );
      }

      closeEditor();
      await loadExperience();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to save experience."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeExperience(id: number) {
    const item = items.find(
      (experience) => experience.id === id
    );

    if (
      !confirm(
        `Delete "${item?.title || "this experience"}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteResource("/experience", id);
      await loadExperience();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete experience."
      );
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "Present";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="publify-experience-page">
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">
            CONTENT
          </span>

          <h1>Experience</h1>

          <p>
            Manage your professional journey and work
            history displayed on the public website.
          </p>
        </div>

        <button
          className="publify-primary-button"
          onClick={startNew}
        >
          <Plus size={17} />
          Add experience
        </button>
      </div>

      {error && (
        <div className="publify-experience-error">
          <div>
            <strong>
              Something went wrong
            </strong>
            <span>{error}</span>
          </div>

          <button
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="publify-experience-summary">
        <div>
          <span>Total positions</span>
          <strong>{items.length}</strong>
        </div>

        <div>
          <span>Current positions</span>
          <strong>{currentCount}</strong>
        </div>

        <div>
          <span>Career entries</span>
          <strong>
            {items.length
              ? items.length
              : 0}
          </strong>
        </div>
      </div>

      <div className="publify-experience-toolbar">
        <div className="publify-experience-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search experience..."
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <span>
          {filteredItems.length}{" "}
          {filteredItems.length === 1
            ? "position"
            : "positions"}
        </span>
      </div>

      {loading ? (
        <div className="publify-content-loading">
          <Loader2
            size={22}
            className="resource-spinner"
          />
          <span>
            Loading experience...
          </span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="publify-experience-empty">
          <div className="publify-experience-empty-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <h3>
            {search
              ? "No matching experience"
              : "No experience yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first professional experience entry."}
          </p>

          {!search && (
            <button
              className="publify-secondary-button"
              onClick={startNew}
            >
              <Plus size={16} />
              Add experience
            </button>
          )}
        </div>
      ) : (
        <div className="publify-experience-list">
          {filteredItems.map((item) => {
            const current = !item.endDate;

            return (
              <div
                className="publify-experience-item"
                key={item.id}
              >
                <div className="publify-experience-line">
                  <div className="publify-experience-dot">
                    {current && (
                      <span />
                    )}
                  </div>
                </div>

                <div className="publify-experience-card">
                  <div className="publify-experience-card-top">
                    <div className="publify-experience-heading">
                      <div className="publify-experience-title-row">
                        <h3>{item.title}</h3>

                        {current && (
                          <span className="current-badge">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="publify-experience-meta">
                        <span>
                          <Building2 size={14} />
                          {item.organization}
                        </span>

                        <span>
                          <CalendarDays size={14} />
                          {formatDate(
                            item.startDate
                          )}{" "}
                          —{" "}
                          {formatDate(
                            item.endDate
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="publify-experience-actions">
                      <button
                        onClick={() =>
                          startEdit(item)
                        }
                        title="Edit experience"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          removeExperience(
                            item.id
                          )
                        }
                        title="Delete experience"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="publify-experience-description">
                      {item.description}
                    </p>
                  )}

                  <div className="publify-experience-order">
                    <GripVertical size={14} />
                    Position #{(item.sortOrder ?? 0) + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingId !== null && (
        <div className="publify-modal-backdrop">
          <div className="publify-modal publify-experience-modal">
            <div className="publify-modal-header">
              <div>
                <span className="publify-modal-eyebrow">
                  {editingId === "new"
                    ? "CREATE"
                    : "EDIT"}
                </span>

                <h2>
                  {editingId === "new"
                    ? "Add experience"
                    : "Edit experience"}
                </h2>
              </div>

              <button
                className="publify-modal-close"
                onClick={closeEditor}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="publify-modal-body">
              <div className="publify-form-field">
                <label htmlFor="experience-title">
                  Job title
                </label>

                <input
                  id="experience-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Software Developer"
                  autoFocus
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="experience-organization">
                  Organization
                </label>

                <input
                  id="experience-organization"
                  type="text"
                  value={
                    form.organization
                  }
                  onChange={(e) =>
                    updateField(
                      "organization",
                      e.target.value
                    )
                  }
                  placeholder="Company or organization"
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="experience-start">
                  Start date
                </label>

                <input
                  id="experience-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    updateField(
                      "startDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="experience-end">
                  End date
                </label>

                <input
                  id="experience-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    updateField(
                      "endDate",
                      e.target.value
                    )
                  }
                />

                <span className="publify-field-hint">
                  Leave empty if this is your
                  current position.
                </span>
              </div>

              <div className="publify-form-field full">
                <label htmlFor="experience-description">
                  Description
                </label>

                <textarea
                  id="experience-description"
                  rows={8}
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe your responsibilities, achievements and key contributions..."
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="experience-order">
                  Display order
                </label>

                <input
                  id="experience-order"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(e) =>
                    updateField(
                      "sortOrder",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="publify-modal-footer">
              <button
                className="publify-secondary-button"
                onClick={closeEditor}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="publify-primary-button"
                onClick={saveExperience}
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
                    {editingId === "new"
                      ? "Create experience"
                      : "Save changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}