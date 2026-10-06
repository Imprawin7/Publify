import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/api";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-page px-6 py-20">
      <h1 className="font-display text-4xl text-ink">Projects</h1>
      <p className="mt-4 max-w-prose text-slate">
        A selection of what I have built, from full-stack web apps to smaller experiments.
      </p>

      <div className="mt-12">
        {projects.length === 0 ? (
          <p className="text-slate">No projects published yet — check back soon.</p>
        ) : (
          projects.map((project) => <ProjectCard key={project.id} project={project} />)
        )}
      </div>
    </div>
  );
}
