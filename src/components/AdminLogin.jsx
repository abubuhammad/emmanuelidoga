import { useState } from "react";
import { supabase, supabaseEnabled } from "../lib/supabase.js";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  if (!supabaseEnabled || !supabase) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface/80 p-6 shadow-2xl shadow-black/20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-project">Admin access</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Configuration required</h1>
        <p className="mt-3 text-sm text-muted">
          Supabase authentication is not configured for this project yet. Add the Supabase environment variables to enable the admin login.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const email = form.username.trim();

      if (!email || !email.includes("@")) {
        throw new Error("Use your admin email address.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      });

      if (error) {
        throw error;
      }

      onLogin?.();
      setStatus({ type: "success", message: "Signed in with Supabase." });
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
      <p className="mt-2 text-sm text-muted">
        Connected to Supabase. Sign in with your admin email and password to manage the live portfolio data.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="font-mono text-xs text-muted">Email</span>
          <input
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="admin@email.com"
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
    </div>
  );
}
