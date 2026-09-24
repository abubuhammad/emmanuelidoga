import { CATEGORIES } from "../data/categories.js";
import { IconArrow } from "./icons.jsx";

const GLYPH_BG = {
  project: "from-accent-project/25 to-accent-project/5",
  certification: "from-accent-cert/25 to-accent-cert/5",
  badge: "from-accent-badge/25 to-accent-badge/5",
  "vibe-coding": "from-accent-vibe/25 to-accent-vibe/5",
};

export default function Card({ item }) {
  const meta = CATEGORIES[item.category];
  return (
    <article className="surface break-inside-avoid overflow-hidden rounded-2xl border">
      <div className={`flex h-20 items-center justify-between bg-gradient-to-br px-5 ${GLYPH_BG[item.category]}`}>
        <span className={`font-display text-2xl font-semibold ${meta.text}`}>
          {item.title.charAt(0).toUpperCase()}
        </span>
        <span className={`h-1.5 w-1.5 rounded-full ${meta.accent}`} />
      </div>

      <div className="p-5">
        <p className={`font-mono text-[11px] ${meta.text}`}>{meta.label.replace(/s$/, "")}</p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">{item.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{item.description}</p>

        {item.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </div>
        )}

        {item.links?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
            {item.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 text-sm font-medium ${meta.text} hover:opacity-80`}
              >
                {l.label} <IconArrow />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
