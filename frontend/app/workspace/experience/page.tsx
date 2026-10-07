"use client";

import WorkspaceCollectionPage from "@/components/workspace/WorkspaceCollectionPage";

export default function WorkspaceExperiencePage() {
  return (
    <WorkspaceCollectionPage
      title="Experience"
      singular="Experience"
      endpoint="/workspace/experience"
      displayField="title"
      description="Manage roles, organizations, dates, and experience details."
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
        },
        {
          name: "organization",
          label: "Organization",
          type: "text",
          required: true,
        },
        {
          name: "startDate",
          label: "Start date",
          type: "date",
        },
        {
          name: "endDate",
          label: "End date",
          type: "date",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
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
