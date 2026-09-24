export default function Journey({ items }) {
  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">Journey</h1>
      <p className="mt-3 max-w-prose text-muted">The short version — key milestones in order.</p>

      {items?.length > 0 ? (
        <ol className="mt-8 space-y-6 border-l border-line pl-6">
          {items.map((m) => (
            <li key={`${m.year}-${m.title}`} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-accent-badge" />
              <p className="font-mono text-xs text-accent-badge">{m.year}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 max-w-prose text-sm text-muted">{m.description}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-10 text-sm text-muted">Add milestones to `journey` in src/data/profile.js.</p>
      )}
    </section>
  );
}
