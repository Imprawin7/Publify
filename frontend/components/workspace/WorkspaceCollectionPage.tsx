"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/workspaceApi";

type FieldType = "text" | "textarea" | "number" | "date" | "select" | "checkbox";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

type CollectionItem = {
  id: number;
  workspace?: {
    id: number;
    name?: string;
  };
  [key: string]: unknown;
};

type Props = {
  title: string;
  description: string;
  endpoint: string;
  singular: string;
  displayField: string;
  fields: Field[];
};

function emptyForm(fields: Field[]) {
  const result: Record<string, string | number | boolean> = {};

  for (const field of fields) {
    if (field.type === "checkbox") {
      result[field.name] = false;
    } else if (field.type === "number") {
      result[field.name] = 0;
    } else {
      result[field.name] = "";
    }
  }

  return result;
}

function normalizeItem(item: CollectionItem, fields: Field[]) {
  const result = emptyForm(fields);

  for (const field of fields) {
    const value = item[field.name];

    if (field.type === "checkbox") {
      result[field.name] = Boolean(value);
    } else if (field.type === "number") {
      result[field.name] =
        typeof value === "number" ? value : Number(value || 0);
    } else {
      result[field.name] =
        value === null || value === undefined ? "" : String(value);
    }
  }

  return result;
}

export default function WorkspaceCollectionPage({
  title,
  description,
  endpoint,
  singular,
  displayField,
  fields,
}: Props) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    emptyForm(fields)
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const modeLabel = editingId === null ? `New ${singular}` : `Edit ${singular}`;

  const displayItems = useMemo(
    () => items.filter((item) => item && item.id),
    [items]
  );

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch(endpoint);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load content");
      }

      const data = (await response.json()) as CollectionItem[];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load content"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [endpoint]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm(fields));
    setShowForm(true);
    setError("");
  }

  function openEdit(item: CollectionItem) {
    setEditingId(item.id);
    setForm(normalizeItem(item, fields));
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm(fields));
  }

  function updateField(
    name: string,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      const value = form[field.name];

      if (field.type === "number") {
        payload[field.name] = Number(value || 0);
      } else if (field.type === "checkbox") {
        payload[field.name] = Boolean(value);
      } else {
        payload[field.name] = value;
      }
    }

    return payload;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await authFetch(
        editingId === null
          ? endpoint
          : `${endpoint}/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save content");
      }

      await load();
      closeForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save content"
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await authFetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete content");
      }

      await load();

      if (editingId === id) {
        closeForm();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete content"
      );
    } finally {
      setDeletingId(null);
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
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#686862]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252521]"
        >
          + New {singular}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mt-6 rounded-2xl border border-[#E1E1DB] bg-white p-6 shadow-[0_16px_40px_rgba(17,17,17,0.04)] sm:p-8">
          <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                {modeLabel}
              </h2>
              <p className="mt-1 text-sm text-[#686862]">
                Update the workspace content fields below.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg px-3 py-2 text-sm text-[#686862] hover:bg-[#F5F5F1]"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={save}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >
            {fields.map((field) => {
              const value = form[field.name];

              if (field.type === "textarea") {
                return (
                  <div
                    key={field.name}
                    className="sm:col-span-2"
                  >
                    <label className="mb-2 block text-sm font-medium">
                      {field.label}
                    </label>

                    <textarea
                      required={field.required}
                      value={String(value ?? "")}
                      onChange={(event) =>
                        updateField(field.name, event.target.value)
                      }
                      rows={6}
                      className="w-full rounded-xl border border-[#DADAD4] px-4 py-3 text-sm outline-none transition focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
                    />
                  </div>
                );
              }

              if (field.type === "checkbox") {
                return (
                  <label
                    key={field.name}
                    className="flex items-center gap-3 rounded-xl border border-[#E1E1DB] px-4 py-4"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) =>
                        updateField(field.name, event.target.checked)
                      }
                      className="h-4 w-4 accent-[#157A5B]"
                    />
                    <span className="text-sm font-medium">
                      {field.label}
                    </span>
                  </label>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-medium">
                      {field.label}
                    </label>

                    <select
                      required={field.required}
                      value={String(value ?? "")}
                      onChange={(event) =>
                        updateField(field.name, event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-[#DADAD4] bg-white px-4 text-sm outline-none transition focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-medium">
                    {field.label}
                  </label>

                  <input
                    type={
                      field.type === "number"
                        ? "number"
                        : field.type === "date"
                        ? "date"
                        : "text"
                    }
                    required={field.required}
                    value={String(value ?? "")}
                    onChange={(event) =>
                      updateField(
                        field.name,
                        field.type === "number"
                          ? Number(event.target.value)
                          : event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DADAD4] bg-white px-4 text-sm outline-none transition focus:border-[#157A5B] focus:ring-4 focus:ring-[#157A5B]/10"
                  />
                </div>
              );
            })}

            <div className="flex justify-end gap-3 border-t border-[#E7E7E2] pt-5 sm:col-span-2">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-[#DADAD4] bg-white px-5 py-3 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-[#E7E7E2] bg-white p-8 text-sm text-[#686862]">
            Loading {title.toLowerCase()}...
          </div>
        ) : displayItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8D8D1] bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              No {title.toLowerCase()} yet
            </h2>

            <p className="mt-2 text-sm text-[#686862]">
              Create your first {singular.toLowerCase()} to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => {
              const displayValue =
                item[displayField] === null ||
                item[displayField] === undefined ||
                item[displayField] === ""
                  ? `Untitled ${singular}`
                  : String(item[displayField]);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E7E7E2] bg-white p-5 transition hover:border-[#D3D3CC]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold">
                        {displayValue}
                      </h2>

                      <p className="mt-1 text-xs text-[#989890]">
                        ID {item.id}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-[#DADAD4] px-3 py-2 text-sm font-medium transition hover:border-[#BDBDB5]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
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
