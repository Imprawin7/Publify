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
  Layers3,
  GripVertical,
  Code2,
  BriefcaseBusiness,
  Database,
  Globe,
  Smartphone,
  Server,
  ShieldCheck,
  Cloud,
  Monitor,
} from "lucide-react";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/adminApi";
import type { ServiceItem } from "@/lib/types";

type ServiceForm = {
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
};

const emptyForm: ServiceForm = {
  title: "",
  description: "",
  icon: "",
  sortOrder: 0,
};

const iconMap: Record<string, React.ElementType> = {
  code: Code2,
  code2: Code2,
  development: Code2,
  briefcase: BriefcaseBusiness,
  database: Database,
  globe: Globe,
  web: Globe,
  smartphone: Smartphone,
  mobile: Smartphone,
  server: Server,
  security: ShieldCheck,
  shield: ShieldCheck,
  cloud: Cloud,
  monitor: Monitor,
};

function ServiceIcon({ name }: { name?: string }) {
  const key = String(name || "").trim().toLowerCase();
  const Icon = iconMap[key] || Layers3;

  return <Icon size={20} />;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadServices() {
    setLoading(true);

    try {
      const data = await listResource<ServiceItem>("/services");

      setServices(
        [...data].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        )
      );

      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return services;

    return services.filter((service) =>
      [service.title, service.description, service.icon]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [services, search]);

  function startNew() {
    setEditingId("new");
    setForm({
      ...emptyForm,
      sortOrder: services.length,
    });
    setError("");
  }

  function startEdit(service: ServiceItem) {
    setEditingId(service.id);

    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      sortOrder: service.sortOrder ?? 0,
    });

    setError("");
  }

  function closeEditor() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof ServiceForm>(
    key: K,
    value: ServiceForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveService() {
    if (!form.title.trim()) {
      setError("Service title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Service description is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon.trim(),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId === "new") {
        await createResource<ServiceItem>("/services", payload);
      } else {
        await updateResource<ServiceItem>(
          "/services",
          editingId as number,
          payload
        );
      }

      closeEditor();
      await loadServices();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeService(id: number) {
    const service = services.find((item) => item.id === id);

    if (
      !confirm(
        `Delete "${service?.title || "this service"}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteResource("/services", id);
      await loadServices();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to delete service."
      );
    }
  }

  return (
    <div className="publify-services-page">
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">CONTENT</span>

          <h1>Services</h1>

          <p>
            Manage the services and capabilities presented on your public
            portfolio.
          </p>
        </div>

        <button
          className="publify-primary-button"
          onClick={startNew}
        >
          <Plus size={17} />
          Add service
        </button>
      </div>

      {error && (
        <div className="publify-services-error">
          <div>
            <strong>Something went wrong</strong>
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

      <div className="publify-services-toolbar">
        <div className="publify-services-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
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
          {filteredServices.length}{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </span>
      </div>

      {loading ? (
        <div className="publify-content-loading">
          <Loader2 size={22} className="resource-spinner" />
          <span>Loading services...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="publify-services-empty">
          <div className="publify-services-empty-icon">
            <Layers3 size={24} />
          </div>

          <h3>
            {search ? "No matching services" : "No services yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first service to start building your public services section."}
          </p>

          {!search && (
            <button
              className="publify-secondary-button"
              onClick={startNew}
            >
              <Plus size={16} />
              Add service
            </button>
          )}
        </div>
      ) : (
        <div className="publify-services-grid">
          {filteredServices.map((service) => (
            <article
              className="publify-service-card"
              key={service.id}
            >
              <div className="publify-service-card-top">
                <div className="publify-service-icon">
                  <ServiceIcon name={service.icon} />
                </div>

                <div className="publify-service-card-actions">
                  <button
                    onClick={() => startEdit(service)}
                    title="Edit service"
                    aria-label={`Edit ${service.title}`}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="danger"
                    onClick={() => removeService(service.id)}
                    title="Delete service"
                    aria-label={`Delete ${service.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="publify-service-content">
                <h3>{service.title}</h3>

                <p>
                  {service.description || "No description provided."}
                </p>
              </div>

              <div className="publify-service-footer">
                <span>
                  <GripVertical size={13} />
                  Order #{(service.sortOrder ?? 0) + 1}
                </span>

                {service.icon && (
                  <code>{service.icon}</code>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {editingId !== null && (
        <div className="publify-modal-backdrop">
          <div className="publify-modal publify-service-modal">
            <div className="publify-modal-header">
              <div>
                <span className="publify-modal-eyebrow">
                  {editingId === "new" ? "CREATE" : "EDIT"}
                </span>

                <h2>
                  {editingId === "new"
                    ? "Add service"
                    : "Edit service"}
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
                <label htmlFor="service-title">Service title</label>

                <input
                  id="service-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="Web Development"
                  autoFocus
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="service-icon">Icon</label>

                <div className="publify-service-icon-input">
                  <div className="publify-service-icon-preview">
                    <ServiceIcon name={form.icon} />
                  </div>

                  <input
                    id="service-icon"
                    type="text"
                    value={form.icon}
                    onChange={(e) =>
                      updateField("icon", e.target.value)
                    }
                    placeholder="code"
                  />
                </div>

                <span className="publify-field-hint">
                  Use a simple icon name such as code, database, globe,
                  smartphone, server, security or cloud.
                </span>
              </div>

              <div className="publify-form-field full">
                <label htmlFor="service-description">
                  Description
                </label>

                <textarea
                  id="service-description"
                  rows={7}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe what this service includes..."
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="service-order">Display order</label>

                <input
                  id="service-order"
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

                <span className="publify-field-hint">
                  Lower numbers appear first.
                </span>
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
                onClick={saveService}
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
                      ? "Create service"
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