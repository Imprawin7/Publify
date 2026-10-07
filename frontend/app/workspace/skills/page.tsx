"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceSkillsPage() {
  return (
    <WorkspaceCollectionPage
      title="Skills"
      singular="Skill"
      endpoint="/workspace/skills"
      displayField="name"
      description="Organize skills, categories, proficiency, and display order."
      fields={[
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "text",
        },
        {
          name: "proficiency",
          label: "Proficiency",
          type: "number",
        },
        {
          name: "icon",
          label: "Icon",
          type: "text",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
        },
      ]}
    />
  );
}
