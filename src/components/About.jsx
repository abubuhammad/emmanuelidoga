export default function About({ profile }) {
  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">About</h1>
      <p className="mt-4 max-w-prose text-muted">{profile.about}</p>

      {profile.stats?.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          {profile.stats.map((s) => (
            <div key={s.label} className="surface rounded-2xl border p-4">
              <p className="font-display text-2xl font-semibold text-accent-project">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {profile.skills?.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-xs text-muted">Skills</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <li key={s} className="surface rounded-full border px-3.5 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
