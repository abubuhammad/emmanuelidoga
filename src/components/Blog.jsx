export default function Blog({ posts }) {
  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">Blog</h1>

      {posts?.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {posts.map((post) => (
            <li key={post.title} className="surface rounded-2xl border p-5">
              <a href={post.href} target="_blank" rel="noreferrer" className="font-display text-lg font-semibold hover:text-accent-project">
                {post.title}
              </a>
              <p className="mt-1.5 text-sm text-muted">{post.excerpt}</p>
              {post.date && <p className="mt-2 font-mono text-xs text-muted">{post.date}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 max-w-prose text-muted">
          No posts yet. Add entries to the `blog` array in src/data/profile.js when there's writing
          to link to.
        </p>
      )}
    </section>
  );
}
