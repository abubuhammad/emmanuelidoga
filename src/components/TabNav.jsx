import { TABS } from "../data/categories.js";

export default function TabNav({ active, onChange }) {
  return (
    <nav className="surface flex flex-wrap gap-1 rounded-2xl border p-1.5">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-xl px-3.5 py-2 font-mono text-xs transition-colors ${
            active === tab
              ? "bg-accent-project/15 text-accent-project"
              : "text-muted hover:text-ink dark:hover:text-ink"
          }`}
        >
          {tab.toLowerCase()}
        </button>
      ))}
    </nav>
  );
}
