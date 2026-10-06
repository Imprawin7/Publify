import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  const stack = project.techStack
    ? project.techStack.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <article className="border-b border-line py-8 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-display text-2xl text-ink">{project.title}</h3>
        <div className="flex gap-4 text-sm">
          {project.repoUrl && (
            <a href={project.repoUrl} className="text-accent hover:underline" target="_blank" rel="noreferrer">
              Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} className="text-accent hover:underline" target="_blank" rel="noreferrer">
              Live site
            </a>
          )}
        </div>
      </div>
      {project.description && (
        <p className="mt-3 max-w-prose text-slate">{project.description}</p>
      )}
      {stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate">
          {stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
