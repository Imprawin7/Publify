"use client";

import AdminShell from "@/components/admin/AdminShell";
import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminTestimonialsPage() {
  return (
    <AdminShell>
      <h1 className="font-display text-2xl text-ink">Testimonials</h1>
      <div className="mt-6">
        <ResourceManager
          resourcePath="/testimonials"
          titleField="authorName"
          fields={[
            { key: "authorName", label: "Author name", type: "text" },
            { key: "authorRole", label: "Author role", type: "text" },
            { key: "message", label: "Message", type: "textarea" },
            { key: "avatarUrl", label: "Avatar URL", type: "text" },
          ]}
        />
      </div>
    </AdminShell>
  );
}
