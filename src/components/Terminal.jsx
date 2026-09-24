export default function Terminal({ profile }) {
  const lines = [
    { cmd: "whoami", out: profile.name },
    { cmd: "cat role.txt", out: profile.title },
    { cmd: "cat location.txt", out: profile.location },
    { cmd: "ls skills/", out: profile.skills.join("  ") },
    { cmd: "cat status.txt", out: profile.available ? (profile.availabilityNote || "available") : "not currently available" },
  ];

  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">Terminal</h1>
      <p className="mt-3 max-w-prose text-muted">The same information, in the format it feels most at home in.</p>

      <div className="surface mt-6 overflow-hidden rounded-2xl border font-mono text-sm">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-cert/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-vibe/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-project/60" />
          <span className="ml-2 text-xs text-muted">~/portfolio</span>
        </div>
        <div className="space-y-3 p-5">
          {lines.map((l) => (
            <div key={l.cmd}>
              <p>
                <span className="text-accent-vibe">➜</span> <span className="text-accent-project">~</span>{" "}
                <span>{l.cmd}</span>
              </p>
              <p className="text-muted">{l.out}</p>
            </div>
          ))}
          <p>
            <span className="text-accent-vibe">➜</span> <span className="text-accent-project">~</span>{" "}
            <span className="animate-pulse">▌</span>
          </p>
        </div>
      </div>
    </section>
  );
}
