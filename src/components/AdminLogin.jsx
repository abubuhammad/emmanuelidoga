import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLogin?.();
      setStatus({ type: "success", message: data.message || "Signed in." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not sign in." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface/80 p-6 shadow-2xl shadow-black/20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-project">Admin access</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-muted">Use your admin credentials to update the portfolio content.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="font-mono text-xs text-muted">Username</span>
          <input
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="admin"
            className="surface w-full rounded-xl border px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent-project"
          />
        </label>

        <label className="block space-y-2">
          <span className="font-mono text-xs text-muted">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className="surface w-full rounded-xl border px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent-project"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent-project px-5 py-2.5 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {status.message && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            status.type === "success" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-accent-project/30 bg-accent-project/5 p-3 text-xs text-muted">
        Default demo credentials: username <span className="font-semibold text-ink">admin</span> and password <span className="font-semibold text-ink">admin123</span>
      </div>
    </div>
  );
}
