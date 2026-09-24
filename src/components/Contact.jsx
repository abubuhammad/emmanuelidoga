import { useState } from "react";

const initialState = { name: "", email: "", message: "" };

export default function Contact({ profile }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      // Same-project relative fetch — the frontend and this API route
      // share one Vercel deployment, so no separate domain or CORS setup.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <section>
      <h1 className="font-display text-3xl font-semibold">Contact</h1>
      <p className="mt-3 max-w-prose text-muted">
        Reach out at{" "}
        <a href={`mailto:${profile.email}`} className="text-ink underline decoration-accent-project/60 underline-offset-4">
          {profile.email}
        </a>{" "}
        or use the form below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid max-w-prose gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="surface rounded-xl border px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent-project"
          />
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            className="surface rounded-xl border px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent-project"
          />
        </div>
        <textarea
          required
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={5}
          className="surface rounded-xl border px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent-project"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-fit rounded-full bg-accent-project px-6 py-2.5 text-sm font-medium text-bg disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "sent" && <p className="text-sm text-accent-vibe">Thanks — your message was received.</p>}
        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      </form>
    </section>
  );
}
