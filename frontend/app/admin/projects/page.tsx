"use client";

import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">CONTENT</span>
          <h1>Projects</h1>
          <p>
            Manage the projects displayed on your public portfolio.
          </p>
        </div>
      </div>

      <ResourceManager
        resourcePath="/projects"
        titleField="title"
        defaultSort={(a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        }
        fields={[
          {
            key: "title",
            label: "Title",
            type: "text",
          },
          {
            key: "description",
            label: "Description",
            type: "textarea",
          },
          {
            key: "techStack",
            label: "Tech stack (comma-separated)",
            type: "text",
          },
          {
            key: "repoUrl",
            label: "Repository URL",
            type: "text",
          },
          {
            key: "liveUrl",
            label: "Live URL",
            type: "text",
          },
          {
            key: "imageUrl",
            label: "Image URL",
            type: "text",
          },
          {
            key: "featured",
            label: "Featured",
            type: "boolean",
          },
          {
            key: "sortOrder",
            label: "Sort order",
            type: "number",
          },
        ]}
      />
    </div>
  );
}