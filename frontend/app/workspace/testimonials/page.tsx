"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceTestimonialsPage() {
  return (
    <WorkspaceCollectionPage
      title="Testimonials"
      singular="Testimonial"
      endpoint="/workspace/testimonials"
      displayField="authorName"
      description="Manage customer and client testimonials for this workspace."
      fields={[
        {
          name: "authorName",
          label: "Author name",
          type: "text",
          required: true,
        },
        {
          name: "authorRole",
          label: "Author role",
          type: "text",
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true,
        },
        {
          name: "avatarUrl",
          label: "Avatar URL",
          type: "text",
        },
      ]}
    />
  );
}
