"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/adminApi";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
  Loader2,
  FileText,
  FolderKanban,
} from "lucide-react";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "date" | "select";
  options?: string[];
};

type Item = Record<string, any>;

export default function ResourceManager({
  resourcePath,
  fields,
  titleField,
  defaultSort,
}: {
  resourcePath: string;
  fields: FieldConfig[];
  titleField: string;
  defaultSort?: (a: Item, b: Item) => number;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Item>({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function refresh() {
    setLoading(true);

    try {
      const data = await listResource<Item>(resourcePath);
      setItems(defaultSort ? [...data].sort(defaultSort) : data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcePath]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field.key];

        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(query);
      })
    );
  }, [items, search, fields]);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setForm({ ...item });
  }

  function startNew() {
    setEditingId("new");

    const blank: Item = {};

    fields.forEach((field) => {
      blank[field.key] =
        field.type === "boolean"
          ? false
          : field.type === "number"
          ? 0
          : field.type === "date"
          ? null
          : field.options?.[0] ?? "";
    });

    setForm(blank);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  async function save() {
    setSaving(true);
    setError("");

    try {
      if (editingId === "new") {
        await createResource(resourcePath, form);
      } else {
        await updateResource(resourcePath, editingId as number, form);
      }

      cancelEdit();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this item? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteResource(resourcePath, id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const resourceName = resourcePath
    .replace("/", "")
    .replace(/s$/, "")
    .replace(/-/g, " ");

  const imageField = fields.find((field) =>
    ["imageUrl", "coverImageUrl", "image"].includes(field.key)
  );

  const statusField = fields.find((field) => field.key === "status");

  return (
    <div className="publify-resource">
      {error && (
        <div className="publify-alert">
          <div>
            <strong>Something went wrong</strong>
            <span>{error}</span>
          </div>

          <button onClick={() => setError("")} aria-label="Close error">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="resource-toolbar">
        <div className="resource-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${resourceName}...`}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="resource-search-clear"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="resource-toolbar-right">
          <span className="resource-count">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </span>

          <button className="publify-primary-button" onClick={startNew}>
            <Plus size={17} />
            Add {resourceName}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="resource-state">
          <Loader2 className="resource-spinner" size={22} />
          <span>Loading content...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="resource-empty">
          <div className="resource-empty-icon">
            {resourcePath === "/blogs" ? (
              <FileText size={23} />
            ) : (
              <FolderKanban size={23} />
            )}
          </div>

          <h3>{search ? "No matching content" : `No ${resourceName} yet`}</h3>

          <p>
            {search
              ? "Try a different search term."
              : `Create your first ${resourceName} to get started.`}
          </p>

          {!search && (
            <button className="publify-secondary-button" onClick={startNew}>
              <Plus size={16} />
              Add {resourceName}
            </button>
          )}
        </div>
      ) : (
        <div className="resource-table-wrap">
          <table className="resource-table">
            <thead>
              <tr>
                <th>Content</th>

                {resourcePath === "/projects" && <th>Technology</th>}

                {statusField && <th>Status</th>}

                {resourcePath === "/projects" && <th>Featured</th>}

                <th className="resource-actions-header">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="resource-content-cell">
                      {imageField ? (
                        <div className="resource-thumbnail">
                          {item[imageField.key] ? (
                            <img
                              src={item[imageField.key]}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon size={18} />
                          )}
                        </div>
                      ) : (
                        <div className="resource-type-icon">
                          {resourcePath === "/blogs" ? (
                            <FileText size={18} />
                          ) : (
                            <FolderKanban size={18} />
                          )}
                        </div>
                      )}

                      <div className="resource-title-wrapper">
                        <strong>
                          {item[titleField] || `#${item.id}`}
                        </strong>

                        {item.slug && (
                          <span>/blog/{item.slug}</span>
                        )}

                        {item.description && (
                          <p>{truncate(item.description, 90)}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {resourcePath === "/projects" && (
                    <td>
                      <div className="resource-tags">
                        {getTechStack(item.techStack)
                          .slice(0, 3)
                          .map((tech) => (
                            <span key={tech}>{tech}</span>
                          ))}

                        {getTechStack(item.techStack).length > 3 && (
                          <span>
                            +{getTechStack(item.techStack).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {statusField && (
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                  )}

                  {resourcePath === "/projects" && (
                    <td>
                      {item.featured ? (
                        <span className="featured-badge">
                          <CheckCircle2 size={14} />
                          Featured
                        </span>
                      ) : (
                        <span className="not-featured">
                          <Circle size={14} />
                          Standard
                        </span>
                      )}
                    </td>
                  )}

                  <td>
                    <div className="resource-actions">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-action-button"
                          title="Open live link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}

                      <button
                        onClick={() => startEdit(item)}
                        className="resource-action-button"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => remove(item.id)}
                        className="resource-action-button danger"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId !== null && (
        <div className="publify-modal-backdrop">
          <div className="publify-modal">
            <div className="publify-modal-header">
              <div>
                <span className="publify-modal-eyebrow">
                  {editingId === "new" ? "CREATE" : "EDIT"}
                </span>

                <h2>
                  {editingId === "new"
                    ? `Create ${resourceName}`
                    : `Edit ${resourceName}`}
                </h2>
              </div>

              <button
                className="publify-modal-close"
                onClick={cancelEdit}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="publify-modal-body">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={`publify-form-field ${
                    field.type === "textarea" ? "full" : ""
                  }`}
                >
                  <label>
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      rows={7}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  ) : field.type === "boolean" ? (
                    <label className="publify-toggle-row">
                      <input
                        type="checkbox"
                        checked={!!form[field.key]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field.key]: e.target.checked,
                          })
                        }
                      />

                      <span className="publify-toggle">
                        <span />
                      </span>

                      <span>
                        {form[field.key] ? "Enabled" : "Disabled"}
                      </span>
                    </label>
                  ) : field.type === "select" ? (
                    <select
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]: e.target.value,
                        })
                      }
                    >
                      {(field.options || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                          ? "date"
                          : "text"
                      }
                      value={
                        field.type === "date" && form[field.key]
                          ? String(form[field.key]).slice(0, 10)
                          : form[field.key] ?? ""
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]:
                            field.type === "number"
                              ? Number(e.target.value)
                              : field.type === "date" &&
                                e.target.value === ""
                              ? null
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="publify-modal-footer">
              <button
                className="publify-secondary-button"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="publify-primary-button"
                onClick={save}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="resource-spinner" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingId === "new" ? "Create" : "Save changes"}
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

function truncate(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}...`;
}

function getTechStack(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "PUBLISHED") {
    return (
      <span className="status-badge published">
        <span className="status-dot" />
        Published
      </span>
    );
  }

  if (normalized === "DRAFT") {
    return (
      <span className="status-badge draft">
        <span className="status-dot" />
        Draft
      </span>
    );
  }

  return (
    <span className="status-badge">
      {status || "Unknown"}
    </span>
  );
}