import Link from "next/link";
import { getPublishedBlogs, getProjects } from "@/lib/api";

export default async function HomePage() {
  const [projects, blogs] = await Promise.all([
    getProjects(true),
    getPublishedBlogs(),
  ]);

  const featuredProjects = projects.slice(0, 3);
  const latestBlogs = blogs.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8F8F5] text-[#111111]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#E7E7E2]">
        <div className="mx-auto max-w-[1320px] px-6 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-10 lg:pb-32 lg:pt-32">

          <div className="max-w-[1050px]">

            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#DEDED8] bg-white px-3.5 py-2 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#157A5B]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#666660]">
                Built for modern publishing
              </span>
            </div>

            <h1 className="max-w-[1050px] text-[clamp(3.6rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              Your content.
              <br />
              <span className="text-[#157A5B]">
                Beautifully managed.
              </span>
            </h1>

            <div className="mt-10 max-w-[700px]">

              <p className="text-lg leading-8 text-[#686862] sm:text-xl">
                Publify gives you a focused workspace to create, organize,
                manage, and publish the content behind your digital presence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center rounded-full bg-[#111111] px-7 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#157A5B]"
                >
                  Get started
                  <span className="ml-3 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-[#D8D8D2] bg-white px-7 py-3.5 text-sm font-medium text-[#33332F] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111]"
                >
                  Discover Publify
                </Link>

              </div>
            </div>
          </div>

          {/* PRODUCT PREVIEW */}
          <div className="relative mt-20 sm:mt-24 lg:mt-28">

            <div className="absolute -inset-16 rounded-[80px] bg-[#157A5B]/[0.035] blur-3xl" />

            <div className="relative overflow-hidden rounded-[22px] border border-[#DCDCD6] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.10)]">

              {/* Browser Bar */}
              <div className="flex h-12 items-center justify-between border-b border-[#E9E9E4] px-5">

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D7D7D1]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D7D7D1]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D7D7D1]" />
                </div>

                <div className="text-[10px] font-semibold tracking-[0.22em] text-[#8A8A84]">
                  PUBLIFY
                </div>

                <div className="w-12" />
              </div>

              <div className="grid min-h-[500px] lg:grid-cols-[225px_1fr]">

                {/* Sidebar */}
                <aside className="hidden border-r border-[#E9E9E4] bg-[#FBFBF9] p-5 lg:block">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-[11px] font-semibold text-white">
                      P
                    </div>

                    <span className="text-sm font-semibold tracking-[-0.025em]">
                      Publify
                    </span>

                  </div>

                  <div className="mt-10">

                    <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A0A099]">
                      Workspace
                    </p>

                    <div className="space-y-1">

                      {[
                        "Overview",
                        "Content",
                        "Projects",
                        "Media",
                        "Resources",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2.5 text-xs ${
                            index === 0
                              ? "bg-[#EAF3EF] font-medium text-[#157A5B]"
                              : "text-[#777771]"
                          }`}
                        >
                          {item}
                        </div>
                      ))}

                    </div>
                  </div>

                  <div className="mt-10">

                    <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A0A099]">
                      Settings
                    </p>

                    <div className="rounded-lg px-3 py-2.5 text-xs text-[#777771]">
                      Workspace settings
                    </div>

                  </div>
                </aside>

                {/* Dashboard */}
                <div className="p-6 sm:p-8 lg:p-10">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999991]">
                        Overview
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                        Good morning.
                      </h2>

                      <p className="mt-1 text-xs text-[#8A8A84]">
                        Here&apos;s what&apos;s happening with your content.
                      </p>

                    </div>

                    <div className="hidden rounded-lg bg-[#111111] px-4 py-2.5 text-[11px] font-medium text-white sm:block">
                      + New content
                    </div>

                  </div>

                  {/* Stats */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">

                    {[
                      ["Published", "128"],
                      ["Drafts", "08"],
                      ["Media", "356"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#E8E8E2] bg-white p-5"
                      >

                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#999991]">
                          {label}
                        </p>

                        <div className="mt-4 flex items-end justify-between">

                          <p className="text-3xl font-semibold tracking-[-0.05em]">
                            {value}
                          </p>

                          <span className="text-[10px] text-[#157A5B]">
                            +12%
                          </span>

                        </div>

                      </div>
                    ))}

                  </div>

                  {/* Recent Content */}
                  <div className="mt-5 rounded-xl border border-[#E8E8E2]">

                    <div className="flex items-center justify-between border-b border-[#EEEEEA] px-5 py-4">

                      <div>

                        <p className="text-xs font-semibold">
                          Recent content
                        </p>

                        <p className="mt-1 text-[10px] text-[#999991]">
                          Your latest publishing activity
                        </p>

                      </div>

                      <span className="text-[10px] text-[#999991]">
                        View all →
                      </span>

                    </div>

                    <div className="px-5">

                      {[
                        "Building better digital experiences",
                        "Designing content workflows",
                        "The future of modern publishing",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between border-b border-[#EEEEEA] py-4 last:border-0"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <span className="text-[10px] text-[#B0B0AA]">
                              0{index + 1}
                            </span>

                            <span className="truncate text-xs text-[#55554F]">
                              {item}
                            </span>

                          </div>

                          <span className="ml-4 hidden rounded-full bg-[#EAF3EF] px-2.5 py-1 text-[9px] font-medium text-[#157A5B] sm:block">
                            Published
                          </span>

                        </div>
                      ))}

                    </div>
                  </div>

                  {/* Bottom Cards */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-xl border border-[#E8E8E2] p-5">

                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#999991]">
                        Publishing
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEEEEA]">
                        <div className="h-full w-[76%] rounded-full bg-[#157A5B]" />
                      </div>

                      <div className="mt-3 flex justify-between text-[10px] text-[#777771]">
                        <span>76% complete</span>
                        <span>12 items</span>
                      </div>

                    </div>

                    <div className="rounded-xl border border-[#E8E8E2] p-5">

                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#999991]">
                        Workspace
                      </p>

                      <p className="mt-3 text-sm font-medium">
                        Everything looks organized.
                      </p>

                      <p className="mt-1 text-[10px] text-[#888881]">
                        No pending actions.
                      </p>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="border-b border-[#E7E7E2]">

        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-8 sm:py-28 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#157A5B]">
                One focused workspace
              </p>

            </div>

            <div>

              <h2 className="max-w-4xl text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Everything your digital content needs, without the unnecessary
                complexity.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#707069] sm:text-lg">
                Publify brings structured content, projects, media, and
                publishing into one focused workspace designed around the way
                modern digital teams work.
              </p>

            </div>

          </div>

          {/* Trust Strip */}
          <div className="mt-16 grid border-y border-[#E4E4DE] sm:grid-cols-4">

            {[
              ["01", "Content"],
              ["02", "Projects"],
              ["03", "Media"],
              ["04", "Publishing"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="flex items-center gap-4 border-b border-[#E4E4DE] py-5 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
              >

                <span className="text-[10px] text-[#A0A099]">
                  {number}
                </span>

                <span className="text-sm font-medium">
                  {label}
                </span>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-[#E7E7E2]">

        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-8 sm:py-28 lg:px-10">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#157A5B]">
                The platform
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Built around your workflow.
              </h2>

            </div>

            <p className="max-w-sm text-sm leading-6 text-[#777771]">
              Simple where it should be. Powerful where it matters.
            </p>

          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[20px] border border-[#DFDFD9] bg-[#DFDFD9] md:grid-cols-2">

            {[
              {
                number: "01",
                title: "Structured content",
                text: "Keep your website content organized, consistent, and easy to manage.",
              },
              {
                number: "02",
                title: "Media library",
                text: "Bring images and publishing assets together in one accessible workspace.",
              },
              {
                number: "03",
                title: "Publishing workflow",
                text: "Move from draft to published content with a clear, centralized workflow.",
              },
              {
                number: "04",
                title: "Connected by API",
                text: "Serve your content wherever your frontend needs it through a clean API.",
              },
            ].map((feature) => (
              <div
                key={feature.number}
                className="group bg-[#F8F8F5] p-8 transition-all duration-300 hover:bg-white sm:p-10 lg:p-12"
              >

                <div className="flex items-start justify-between">

                  <span className="text-[10px] font-semibold text-[#157A5B]">
                    {feature.number}
                  </span>

                  <span className="text-xl text-[#B0B0AA] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>

                </div>

                <div className="mt-16 max-w-md">

                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#73736D]">
                    {feature.text}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="border-b border-[#E7E7E2]">

          <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-8 sm:py-28 lg:px-10">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#157A5B]">
                  Showcase
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
                  Built with Publify.
                </h2>

              </div>

              <Link
                href="/projects"
                className="hidden text-sm font-medium transition-colors hover:text-[#157A5B] sm:block"
              >
                View all projects →
              </Link>

            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">

              {featuredProjects.map((project) => (
                <Link
                  href="/projects"
                  key={project.id}
                  className="group overflow-hidden rounded-[18px] border border-[#DFDFD9] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
                >

                  <div className="aspect-[1.35/1] overflow-hidden bg-[#ECECE7]">

                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999991]">
                          Publify
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      <h3 className="font-semibold tracking-[-0.025em]">
                        {project.title}
                      </h3>

                      <span className="text-[#999991] transition-transform duration-300 group-hover:translate-x-1">
                        ↗
                      </span>

                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#777771]">
                      {project.description}
                    </p>

                  </div>

                </Link>
              ))}

            </div>

            <Link
              href="/projects"
              className="mt-8 inline-block text-sm font-medium sm:hidden"
            >
              View all projects →
            </Link>

          </div>

        </section>
      )}

      {/* BLOG */}
      {latestBlogs.length > 0 && (
        <section className="border-b border-[#E7E7E2]">

          <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-8 sm:py-28 lg:px-10">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#157A5B]">
                  From the journal
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
                  Ideas worth publishing.
                </h2>

              </div>

              <Link
                href="/blog"
                className="hidden text-sm font-medium transition-colors hover:text-[#157A5B] sm:block"
              >
                View all articles →
              </Link>

            </div>

            <div className="mt-12 divide-y divide-[#E4E4DE] border-y border-[#E4E4DE]">

              {latestBlogs.map((blog, index) => (
                <Link
                  href={`/blog/${blog.slug}`}
                  key={blog.id}
                  className="group grid gap-4 py-7 transition-colors hover:bg-white sm:grid-cols-[70px_1fr_auto] sm:items-center sm:px-5"
                >

                  <span className="text-[10px] text-[#A0A099]">
                    0{index + 1}
                  </span>

                  <div>

                    <h3 className="font-medium tracking-[-0.015em]">
                      {blog.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#85857E]">
                      Published article
                    </p>

                  </div>

                  <span className="text-[#A0A099] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </Link>
              ))}

            </div>

          </div>

        </section>
      )}

      {/* FINAL CTA */}
      <section>

        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-8 sm:py-32 lg:px-10">

          <div className="relative overflow-hidden rounded-[28px] bg-[#111111] px-7 py-14 text-white sm:px-12 sm:py-20 lg:px-16 lg:py-24">

            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#157A5B]/20 blur-3xl" />

            <div className="relative max-w-3xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78B59F]">
                Start publishing
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Give your content
                <br />
                a better home.
              </h2>

              <p className="mt-7 max-w-xl text-base leading-7 text-[#A9AAA5] sm:text-lg">
                A focused workspace for creating, organizing, managing, and
                publishing the content behind your digital presence.
              </p>

              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#157A5B] hover:text-white"
              >
                Get started
                <span className="ml-3 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}