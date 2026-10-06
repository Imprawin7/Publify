"use client";

import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminBlogsPage() {
  return (
    <div>
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">CONTENT</span>
          <h1>Blog</h1>
          <p>
            Create, edit and publish articles for your public website.
          </p>
        </div>
      </div>

      <div className="publify-info-strip">
        <span>Publishing</span>
        <p>
          Slug becomes the URL: <strong>/blog/your-slug</strong>.
          Setting a post to <strong>PUBLISHED</strong> automatically
          stamps the publish date the first time.
        </p>
      </div>

      <ResourceManager
        resourcePath="/blogs"
        titleField="title"
        fields={[
          {
            key: "title",
            label: "Title",
            type: "text",
          },
          {
            key: "slug",
            label: "Slug",
            type: "text",
          },
          {
            key: "content",
            label: "Content",
            type: "textarea",
          },
          {
            key: "coverImageUrl",
            label: "Cover image URL",
            type: "text",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["DRAFT", "PUBLISHED"],
          },
        ]}
      />
    </div>
  );
}