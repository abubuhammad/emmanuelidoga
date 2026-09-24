import { useMemo, useState } from "react";
import { CATEGORIES } from "../data/categories.js";
import Card from "./Card.jsx";
import { IconSearch } from "./icons.jsx";

export default function Portfolio({ title, items }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: items.length };
    for (const key of Object.keys(CATEGORIES)) {
      c[key] = items.filter((i) => i.category === key).length;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesFilter = filter === "all" || i.category === filter;
      const matchesQuery =
        !query ||
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.description.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [items, filter, query]);

  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-prose text-muted">
        A running record of projects, certifications, and badges — everything below is verifiable
        via the linked source.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
              filter === "all" ? "bg-ink text-bg dark:bg-ink dark:text-bg" : "surface border text-muted"
            }`}
          >
            All ({counts.all})
          </button>
          {Object.entries(CATEGORIES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                filter === key ? `${meta.accent} text-bg` : "surface border text-muted"
              }`}
            >
              {meta.label} ({counts[key] || 0})
            </button>
          ))}
        </div>

        <label className="surface ml-auto flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-muted">
          <IconSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-28 bg-transparent text-sm outline-none placeholder:text-muted sm:w-40"
          />
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
          {filtered.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted">Nothing matches that search yet.</p>
      )}
    </section>
  );
}
