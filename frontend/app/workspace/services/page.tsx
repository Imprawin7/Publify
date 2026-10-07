"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceServicesPage() {
  return (
    <WorkspaceCollectionPage
      title="Services"
      singular="Service"
      endpoint="/workspace/services"
      displayField="title"
      description="Manage the services offered through this workspace."
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
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
