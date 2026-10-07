"use client";

import Link from "next/link";

const sections = [
  {
    label: "Projects",
    href: "/workspace/projects",
    description: "Manage portfolio and product projects.",
  },
  {
    label: "Blogs",
    href: "/workspace/blogs",
    description: "Write, edit, and publish articles.",
  },
  {
    label: "Services",
    href: "/workspace/services",
    description: "Manage your service offering.",
  },
  {
    label: "Experience",
    href: "/workspace/experience",
    description: "Maintain professional experience.",
  },
  {
    label: "Skills",
    href: "/workspace/skills",
    description: "Organize capabilities and proficiency.",
  },
  {
    label: "Testimonials",
    href: "/workspace/testimonials",
    description: "Manage customer and client feedback.",
  },
  {
    label: "About",
    href: "/workspace/about",
    description: "Edit your workspace profile content.",
  },
  {
    label: "Media",
    href: "/workspace/media",
    description: "Upload and manage content assets.",
  },
];

export default function WorkspaceHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="rounded-2xl border border-[#E1E1DB] bg-white p-7 shadow-[0_16px_40px_rgba(17,17,17,0.04)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#157A5B]">
          Overview
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
          Your publishing workspace is ready.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[#686862]">
          Manage your content, media, and publishing workflow from one focused
          workspace.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section, index) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-[#E7E7E2] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#CDCDC6] hover:shadow-[0_12px_32px_rgba(17,17,17,0.05)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F4F0] text-xs font-semibold text-[#157A5B]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <h2 className="mt-5 text-base font-semibold group-hover:text-[#157A5B]">
              {section.label}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#686862]">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
