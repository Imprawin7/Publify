"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceBlogsPage() {
  return (
    <WorkspaceCollectionPage
      title="Blogs"
      singular="Blog"
      endpoint="/workspace/blogs"
      displayField="title"
      description="Write, edit, and publish content from your workspace."
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          label: "Slug",
          type: "text",
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: ["DRAFT", "PUBLISHED"],
        },
        {
          name: "coverImageUrl",
          label: "Cover image URL",
          type: "text",
        },
        {
          name: "content",
          label: "Content",
          type: "textarea",
        },
      ]}
    />
  );
}
