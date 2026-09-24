import { IconMail, IconLinkedIn, IconGitHub, IconX, IconDownload, IconSun, IconMoon } from "./icons.jsx";

function initialsOf(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Sidebar({ profile, theme, onToggleTheme }) {
  return (
    <aside className="surface rounded-2xl border p-5 lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-accent-project/15 shadow-lg shadow-black/20">
            <img
              src="/Emmanuel.jpeg"
              alt={profile.name}
              className="h-full w-full object-cover object-center"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextSibling.style.display = "grid";
              }}
            />
            <div className="hidden h-full w-full place-items-center font-display text-base font-semibold text-accent-project">
              {initialsOf(profile.name)}
            </div>
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight">{profile.name}</p>
            <p className="text-sm text-muted">{profile.title}</p>
          </div>
        </div>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current/15 text-muted transition-colors hover:text-accent-project"
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </div>

      {profile.available && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-vibe/10 px-3 py-1 text-xs text-accent-vibe">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-vibe" />
          {profile.availabilityNote || "Available"}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={profile.resumeUrl}
          download
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg dark:bg-ink dark:text-bg"
        >
          <IconDownload /> Download CV
        </a>
        <div className="flex items-center gap-1 text-muted">
          <a href={`mailto:${profile.email}`} aria-label="Email" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-accent-project">
            <IconMail />
          </a>
          {profile.social?.linkedin && (
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-accent-project">
              <IconLinkedIn />
            </a>
          )}
          {profile.social?.github && (
            <a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-accent-project">
              <IconGitHub />
            </a>
          )}
          {profile.social?.twitter && (
            <a href={profile.social.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-accent-project">
              <IconX />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
