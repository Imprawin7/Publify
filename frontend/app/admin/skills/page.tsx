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
  Code2,
  GripVertical,
} from "lucide-react";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/adminApi";
import type { Skill } from "@/lib/types";

type SkillForm = {
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  sortOrder: number;
};

const emptyForm: SkillForm = {
  name: "",
  category: "",
  proficiency: 80,
  icon: "",
  sortOrder: 0,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadSkills() {
    setLoading(true);

    try {
      const data = await listResource<Skill>("/skills");

      setSkills(
        [...data].sort(
          (a, b) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        )
      );

      setError("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return skills;

    return skills.filter((skill) =>
      [
        skill.name,
        skill.category,
        skill.icon,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [skills, search]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        skills
          .map((skill) => skill.category)
          .filter(Boolean)
      )
    );
  }, [skills]);

  function startNew() {
    setEditingId("new");
    setForm({
      ...emptyForm,
      sortOrder: skills.length,
    });
    setError("");
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      proficiency: skill.proficiency ?? 80,
      icon: skill.icon || "",
      sortOrder: skill.sortOrder ?? 0,
    });

    setError("");
  }

  function closeEditor() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof SkillForm>(
    key: K,
    value: SkillForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSkill() {
    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      proficiency: Math.min(
        100,
        Math.max(0, Number(form.proficiency))
      ),
      icon: form.icon.trim(),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId === "new") {
        await createResource<Skill>(
          "/skills",
          payload
        );
      } else {
        await updateResource<Skill>(
          "/skills",
          editingId as number,
          payload
        );
      }

      closeEditor();
      await loadSkills();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeSkill(id: number) {
    const skill = skills.find(
      (item) => item.id === id
    );

    if (
      !confirm(
        `Delete "${skill?.name || "this skill"}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteResource("/skills", id);
      await loadSkills();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete skill."
      );
    }
  }

  return (
    <div className="publify-skills-page">
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">
            CONTENT
          </span>

          <h1>Skills</h1>

          <p>
            Manage the technologies and capabilities
            displayed on your public portfolio.
          </p>
        </div>

        <button
          className="publify-primary-button"
          onClick={startNew}
        >
          <Plus size={17} />
          Add skill
        </button>
      </div>

      {error && (
        <div className="publify-skills-error">
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

      <div className="publify-skills-summary">
        <div className="publify-skill-summary-card">
          <span>Total skills</span>
          <strong>{skills.length}</strong>
        </div>

        <div className="publify-skill-summary-card">
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>

        <div className="publify-skill-summary-card">
          <span>Average proficiency</span>
          <strong>
            {skills.length
              ? Math.round(
                  skills.reduce(
                    (total, skill) =>
                      total +
                      (skill.proficiency ?? 0),
                    0
                  ) / skills.length
                )
              : 0}
            %
          </strong>
        </div>
      </div>

      <div className="publify-skills-toolbar">
        <div className="publify-skills-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search skills..."
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
          {filteredSkills.length}{" "}
          {filteredSkills.length === 1
            ? "skill"
            : "skills"}
        </span>
      </div>

      {loading ? (
        <div className="publify-content-loading">
          <Loader2
            size={22}
            className="resource-spinner"
          />
          <span>Loading skills...</span>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="publify-skills-empty">
          <div className="publify-skills-empty-icon">
            <Code2 size={24} />
          </div>

          <h3>
            {search
              ? "No matching skills"
              : "No skills yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first skill to build your technology profile."}
          </p>

          {!search && (
            <button
              className="publify-secondary-button"
              onClick={startNew}
            >
              <Plus size={16} />
              Add your first skill
            </button>
          )}
        </div>
      ) : (
        <div className="publify-skills-list">
          {filteredSkills.map((skill) => {
            const proficiency = Math.min(
              100,
              Math.max(
                0,
                skill.proficiency ?? 0
              )
            );

            return (
              <div
                className="publify-skill-row"
                key={skill.id}
              >
                <div className="publify-skill-drag">
                  <GripVertical size={17} />
                </div>

                <div className="publify-skill-icon">
                  {skill.icon ? (
                    <span>
                      {skill.icon}
                    </span>
                  ) : (
                    <Code2 size={19} />
                  )}
                </div>

                <div className="publify-skill-main">
                  <div className="publify-skill-title">
                    <strong>{skill.name}</strong>

                    {skill.category && (
                      <span>
                        {skill.category}
                      </span>
                    )}
                  </div>

                  <div className="publify-skill-progress">
                    <div>
                      <span />
                    </div>

                    <strong>
                      {proficiency}%
                    </strong>
                  </div>
                </div>

                <div className="publify-skill-order">
                  #{(skill.sortOrder ?? 0) + 1}
                </div>

                <div className="publify-skill-actions">
                  <button
                    onClick={() =>
                      startEdit(skill)
                    }
                    title="Edit skill"
                    aria-label={`Edit ${skill.name}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="danger"
                    onClick={() =>
                      removeSkill(skill.id)
                    }
                    title="Delete skill"
                    aria-label={`Delete ${skill.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingId !== null && (
        <div className="publify-modal-backdrop">
          <div className="publify-modal publify-skill-modal">
            <div className="publify-modal-header">
              <div>
                <span className="publify-modal-eyebrow">
                  {editingId === "new"
                    ? "CREATE"
                    : "EDIT"}
                </span>

                <h2>
                  {editingId === "new"
                    ? "Add skill"
                    : "Edit skill"}
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
                <label htmlFor="skill-name">
                  Skill name
                </label>

                <input
                  id="skill-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Java"
                  autoFocus
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="skill-category">
                  Category
                </label>

                <input
                  id="skill-category"
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    updateField(
                      "category",
                      e.target.value
                    )
                  }
                  placeholder="Programming Languages"
                />
              </div>

              <div className="publify-form-field">
                <label htmlFor="skill-icon">
                  Icon
                </label>

                <input
                  id="skill-icon"
                  type="text"
                  value={form.icon}
                  onChange={(e) =>
                    updateField(
                      "icon",
                      e.target.value
                    )
                  }
                  placeholder="☕"
                />

                <span className="publify-field-hint">
                  Enter an emoji, character or icon
                  identifier.
                </span>
              </div>

              <div className="publify-form-field">
                <label htmlFor="skill-order">
                  Display order
                </label>

                <input
                  id="skill-order"
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

              <div className="publify-form-field full">
                <div className="publify-proficiency-header">
                  <label htmlFor="skill-proficiency">
                    Proficiency
                  </label>

                  <strong>
                    {form.proficiency}%
                  </strong>
                </div>

                <input
                  id="skill-proficiency"
                  className="publify-range-input"
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) =>
                    updateField(
                      "proficiency",
                      Number(e.target.value)
                    )
                  }
                />

                <div className="publify-range-labels">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
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
                onClick={saveSkill}
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
                      ? "Create skill"
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