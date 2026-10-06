import { getExperience } from "@/lib/api";

function formatRange(start?: string, end?: string | null) {
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  if (!start) return "";
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <div className="mx-auto max-w-page px-6 py-20">
      <h1 className="font-display text-4xl text-ink">Experience</h1>

      {/* This content genuinely is a chronological sequence, so a numbered/ordered
          timeline treatment is earned here — not a default decoration. */}
      <ol className="mt-12 space-y-10 border-l border-line pl-8">
        {experience.length === 0 && <p className="text-slate">Nothing listed yet.</p>}
        {experience.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[calc(2rem+4.5px)] top-1.5 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-slate">{formatRange(item.startDate, item.endDate)}</p>
            <h2 className="mt-1 font-display text-xl text-ink">{item.title}</h2>
            <p className="text-slate">{item.organization}</p>
            {item.description && (
              <p className="mt-3 max-w-prose text-ink">{item.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
