import { getAbout, getSkills } from "@/lib/api";

export default async function AboutPage() {
  const [about, skills] = await Promise.all([getAbout(), getSkills()]);

  const grouped: Record<string, typeof skills> = {};
  for (const skill of skills) {
    const category = skill.category || "Other";
    grouped[category] = grouped[category] || [];
    grouped[category].push(skill);
  }

  return (
    <div className="mx-auto max-w-page px-6 py-20">
      <h1 className="font-display text-4xl text-ink">About</h1>

      {about?.bio && (
        <p className="mt-8 max-w-prose text-lg leading-relaxed text-ink">{about.bio}</p>
      )}

      <dl className="mt-10 grid max-w-prose grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-sm">
        {about?.location && (
          <>
            <dt className="text-slate">Based in</dt>
            <dd className="text-ink">{about.location}</dd>
          </>
        )}
        {about?.email && (
          <>
            <dt className="text-slate">Email</dt>
            <dd className="text-ink">
              <a href={`mailto:${about.email}`} className="hover:underline">
                {about.email}
              </a>
            </dd>
          </>
        )}
        {about?.resumeUrl && (
          <>
            <dt className="text-slate">Resume</dt>
            <dd className="text-ink">
              <a href={about.resumeUrl} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                Download
              </a>
            </dd>
          </>
        )}
      </dl>

      {Object.keys(grouped).length > 0 && (
        <div className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-ink">Skills</h2>
          <div className="mt-6 space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm text-slate">{category}</h3>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-ink">
                  {items.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
