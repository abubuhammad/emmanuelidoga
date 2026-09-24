import { IconDownload } from "./icons.jsx";

export default function Resume({ profile }) {
  const resumeUrl = profile.resumeUrl || "";

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">Resume</h1>
        <a
          href={resumeUrl || undefined}
          download={resumeUrl ? "Emmanuel-Idoga-CV.pdf" : undefined}
          aria-disabled={!resumeUrl}
          onClick={(event) => {
            if (!resumeUrl) {
              event.preventDefault();
            }
          }}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ${
            resumeUrl ? "bg-ink text-bg dark:bg-ink dark:text-bg" : "pointer-events-none bg-muted/20 text-muted"
          }`}
        >
          <IconDownload /> Download CV
        </a>
      </div>

      <ol className="mt-8 space-y-8 border-l border-line pl-6">
        {profile.experience.map((job) => (
          <li key={`${job.company}-${job.role}`} className="relative">
            <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-accent-project" />
            <p className="font-mono text-xs text-muted">{job.period}</p>
            <h3 className="mt-1 font-display text-lg font-semibold">
              {job.role} <span className="text-muted">· {job.company}</span>
            </h3>
            <p className="text-xs text-muted">{job.location}</p>
            <p className="mt-2 max-w-prose text-sm text-muted">{job.summary}</p>
          </li>
        ))}
      </ol>

      {profile.education?.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs text-muted">Education</p>
          <ul className="mt-4 space-y-3">
            {profile.education.map((ed) => (
              <li key={ed.school} className="surface flex flex-col gap-1 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display font-semibold">{ed.school}</p>
                  <p className="text-sm text-muted">{ed.degree}</p>
                </div>
                <p className="font-mono text-xs text-muted">{ed.period}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
