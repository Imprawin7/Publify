"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceProjectsPage() {
  return (
    <WorkspaceCollectionPage
      title="Projects"
      singular="Project"
      endpoint="/workspace/projects"
      displayField="title"
      description="Create and manage projects that belong to this workspace."
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
        },
        {
          name: "techStack",
          label: "Tech stack",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
        },
        {
          name: "repoUrl",
          label: "Repository URL",
          type: "text",
        },
        {
          name: "liveUrl",
          label: "Live URL",
          type: "text",
        },
        {
          name: "imageUrl",
          label: "Image URL",
          type: "text",
        },
        {
          name: "featured",
          label: "Featured project",
          type: "checkbox",
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
