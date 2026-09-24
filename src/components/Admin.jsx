import { useEffect, useState } from "react";

const panelClass = "rounded-3xl border border-line bg-surface/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm";
const inputClass = "surface w-full rounded-2xl border border-line px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted transition focus:border-accent-project focus:ring-2 focus:ring-accent-project/20";

function toCSV(value) {
  if (!Array.isArray(value)) return "";
  return value.filter(Boolean).join(", ");
}

export default function Admin({ profile, onSave }) {
  const [draft, setDraft] = useState(profile || {});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(profile || {});
  }, [profile]);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocialField = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (key, index, field, value) => {
    setDraft((prev) => {
      const items = Array.isArray(prev[key]) ? prev[key] : [];
      const next = [...items];
      if (!next[index]) next[index] = {};
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [key]: next };
    });
  };

  const addArrayItem = (key, template) => {
    setDraft((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), template],
    }));
  };

  const removeArrayItem = (key, index) => {
    setDraft((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));
  };

  const updatePortfolioTags = (index, value) => {
    setDraft((prev) => {
      const next = [...(prev.portfolio || [])];
      next[index] = {
        ...next[index],
        tags: value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      return { ...prev, portfolio: next };
    });
  };

  const updatePortfolioLink = (portfolioIndex, linkIndex, field, value) => {
    setDraft((prev) => {
      const nextPortfolio = [...(prev.portfolio || [])];
      const nextLinks = [...(nextPortfolio[portfolioIndex]?.links || [])];
      nextLinks[linkIndex] = { ...nextLinks[linkIndex], [field]: value };
      nextPortfolio[portfolioIndex] = { ...nextPortfolio[portfolioIndex], links: nextLinks };
      return { ...prev, portfolio: nextPortfolio };
    });
  };

  const addPortfolioLink = (portfolioIndex) => {
    setDraft((prev) => {
      const nextPortfolio = [...(prev.portfolio || [])];
      const links = [...(nextPortfolio[portfolioIndex]?.links || []), { label: "", href: "" }];
      nextPortfolio[portfolioIndex] = { ...nextPortfolio[portfolioIndex], links };
      return { ...prev, portfolio: nextPortfolio };
    });
  };

  const removePortfolioLink = (portfolioIndex, linkIndex) => {
    setDraft((prev) => {
      const nextPortfolio = [...(prev.portfolio || [])];
      const links = (nextPortfolio[portfolioIndex]?.links || []).filter((_, i) => i !== linkIndex);
      nextPortfolio[portfolioIndex] = { ...nextPortfolio[portfolioIndex], links };
      return { ...prev, portfolio: nextPortfolio };
    });
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window?.supabase && !window?.__SUPABASE__) {
      setStatus({ type: "error", message: "Configure Supabase before uploading a CV file." });
      event.target.value = "";
      return;
    }

    try {
      const { supabase } = await import("../lib/supabase.js");
      if (!supabase) {
        throw new Error("Supabase is not configured for file uploads.");
      }

      const bucketName = "resumes";
      const { data: bucketData } = await supabase.storage.listBuckets();
      const bucketExists = bucketData?.some((bucket) => bucket.name === bucketName);

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
        if (createError) {
          throw new Error(createError.message || "Unable to create the resumes bucket.");
        }
      }

      const safeFileName = `cv-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from(bucketName).upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "application/pdf",
      });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      updateField("resumeUrl", publicUrlData.publicUrl);
      setStatus({ type: "success", message: "CV uploaded successfully and linked to the profile." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to upload CV file." });
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const result = await onSave(draft);
      setStatus({ type: "success", message: result?.message || "Profile saved successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to save profile." });
    } finally {
      setSaving(false);
    }
  };

  const current = draft || {};

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-project">Portfolio dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Admin editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-200">
            Live sync
          </span>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent-project px-5 py-2.5 text-sm font-medium text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>

      {status.message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Profile</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Identity</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Name</span>
            <input value={current.name || ""} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Title</span>
            <input value={current.title || ""} onChange={(e) => updateField("title", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Location</span>
            <input value={current.location || ""} onChange={(e) => updateField("location", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Email</span>
            <input value={current.email || ""} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Availability note</span>
            <input value={current.availabilityNote || ""} onChange={(e) => updateField("availabilityNote", e.target.value)} className={inputClass} />
          </label>
          <div className="space-y-2 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Resume URL</span>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input value={current.resumeUrl || ""} onChange={(e) => updateField("resumeUrl", e.target.value)} className={`${inputClass} flex-1`} placeholder="https://.../resume.pdf" />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-accent-project/40 bg-accent-project/10 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-accent-project">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                Upload CV
              </label>
            </div>
            <p className="text-[11px] text-muted">Upload a PDF or DOCX file to store the CV in the backend and automatically generate a public resume link.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">LinkedIn</span>
            <input value={current.social?.linkedin || ""} onChange={(e) => updateSocialField("linkedin", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">GitHub</span>
            <input value={current.social?.github || ""} onChange={(e) => updateSocialField("github", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">X / Twitter</span>
            <input value={current.social?.twitter || ""} onChange={(e) => updateSocialField("twitter", e.target.value)} className={inputClass} />
          </label>
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">About</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Story</span>
        </div>

        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Bio</span>
          <textarea value={current.about || ""} onChange={(e) => updateField("about", e.target.value)} rows={7} className={inputClass} />
        </label>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Stats</h3>
            <button type="button" onClick={() => addArrayItem("stats", { label: "", value: "" })} className="text-sm text-accent-project">+ Add stat</button>
          </div>
          {(current.stats || []).map((stat, index) => (
            <div key={`${stat.label || "stat"}-${index}`} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
              <input value={stat.label || ""} onChange={(e) => updateArrayItem("stats", index, "label", e.target.value)} placeholder="Label" className={inputClass} />
              <input value={stat.value || ""} onChange={(e) => updateArrayItem("stats", index, "value", e.target.value)} placeholder="Value" className={inputClass} />
              <button type="button" onClick={() => removeArrayItem("stats", index)} className="rounded-2xl border border-red-500/30 px-3 text-sm text-red-300">Remove</button>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Skills</h3>
            <button type="button" onClick={() => addArrayItem("skills", "")} className="text-sm text-accent-project">+ Add skill</button>
          </div>
          <textarea
            value={toCSV(current.skills || [])}
            onChange={(e) => updateField("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            rows={4}
            placeholder="Azure, Docker, Terraform"
            className={inputClass}
          />
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Resume</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Experience</span>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Roles</h3>
            <button type="button" onClick={() => addArrayItem("experience", { role: "", company: "", period: "", location: "", summary: "" })} className="text-sm text-accent-project">+ Add role</button>
          </div>
          {(current.experience || []).map((job, index) => (
            <div key={`${job.company || "role"}-${index}`} className="rounded-2xl border border-line bg-bg/30 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={job.role || ""} onChange={(e) => updateArrayItem("experience", index, "role", e.target.value)} placeholder="Role" className={inputClass} />
                <input value={job.company || ""} onChange={(e) => updateArrayItem("experience", index, "company", e.target.value)} placeholder="Company" className={inputClass} />
                <input value={job.period || ""} onChange={(e) => updateArrayItem("experience", index, "period", e.target.value)} placeholder="Period" className={inputClass} />
                <input value={job.location || ""} onChange={(e) => updateArrayItem("experience", index, "location", e.target.value)} placeholder="Location" className={inputClass} />
              </div>
              <textarea value={job.summary || ""} onChange={(e) => updateArrayItem("experience", index, "summary", e.target.value)} rows={4} placeholder="Summary" className={`${inputClass} mt-3`} />
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => removeArrayItem("experience", index)} className="rounded-2xl border border-red-500/30 px-3 py-2 text-sm text-red-300">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Education</h3>
            <button type="button" onClick={() => addArrayItem("education", { school: "", degree: "", period: "" })} className="text-sm text-accent-project">+ Add education</button>
          </div>
          {(current.education || []).map((item, index) => (
            <div key={`${item.school || "edu"}-${index}`} className="grid gap-3 rounded-2xl border border-line bg-bg/30 p-4 md:grid-cols-[1.4fr,1fr,auto]">
              <input value={item.school || ""} onChange={(e) => updateArrayItem("education", index, "school", e.target.value)} placeholder="School" className={inputClass} />
              <input value={item.degree || ""} onChange={(e) => updateArrayItem("education", index, "degree", e.target.value)} placeholder="Degree" className={inputClass} />
              <div className="flex gap-2">
                <input value={item.period || ""} onChange={(e) => updateArrayItem("education", index, "period", e.target.value)} placeholder="Period" className={`${inputClass} w-full`} />
                <button type="button" onClick={() => removeArrayItem("education", index)} className="rounded-2xl border border-red-500/30 px-3 text-sm text-red-300">×</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Journey</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Milestones</span>
        </div>
        <div className="space-y-4">
          <button type="button" onClick={() => addArrayItem("journey", { year: "", title: "", description: "" })} className="text-sm text-accent-project">+ Add milestone</button>
          {(current.journey || []).map((item, index) => (
            <div key={`${item.year || "journey"}-${index}`} className="rounded-2xl border border-line bg-bg/30 p-4">
              <div className="grid gap-3 md:grid-cols-[120px,1fr]">
                <input value={item.year || ""} onChange={(e) => updateArrayItem("journey", index, "year", e.target.value)} placeholder="Year" className={inputClass} />
                <input value={item.title || ""} onChange={(e) => updateArrayItem("journey", index, "title", e.target.value)} placeholder="Title" className={inputClass} />
              </div>
              <textarea value={item.description || ""} onChange={(e) => updateArrayItem("journey", index, "description", e.target.value)} rows={3} placeholder="Description" className={`${inputClass} mt-3`} />
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => removeArrayItem("journey", index)} className="rounded-2xl border border-red-500/30 px-3 py-2 text-sm text-red-300">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Blog</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Posts</span>
        </div>
        <div className="space-y-4">
          <button type="button" onClick={() => addArrayItem("blog", { title: "", excerpt: "", href: "", date: "" })} className="text-sm text-accent-project">+ Add post</button>
          {(current.blog || []).map((post, index) => (
            <div key={`${post.title || "post"}-${index}`} className="rounded-2xl border border-line bg-bg/30 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={post.title || ""} onChange={(e) => updateArrayItem("blog", index, "title", e.target.value)} placeholder="Title" className={inputClass} />
                <input value={post.date || ""} onChange={(e) => updateArrayItem("blog", index, "date", e.target.value)} placeholder="Date" className={inputClass} />
              </div>
              <textarea value={post.excerpt || ""} onChange={(e) => updateArrayItem("blog", index, "excerpt", e.target.value)} rows={3} placeholder="Excerpt" className={`${inputClass} mt-3`} />
              <input value={post.href || ""} onChange={(e) => updateArrayItem("blog", index, "href", e.target.value)} placeholder="URL" className={`${inputClass} mt-3`} />
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => removeArrayItem("blog", index)} className="rounded-2xl border border-red-500/30 px-3 py-2 text-sm text-red-300">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Portfolio</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Highlights</span>
        </div>
        <div className="space-y-5">
          <button type="button" onClick={() => addArrayItem("portfolio", { id: "", category: "project", title: "", description: "", tags: [""], links: [{ label: "", href: "" }] })} className="text-sm text-accent-project">+ Add item</button>
          {(current.portfolio || []).map((item, index) => (
            <div key={`${item.title || "portfolio"}-${index}`} className="rounded-2xl border border-line bg-bg/30 p-4">
              <div className="grid gap-3 md:grid-cols-[180px,1fr]">
                <select value={item.category || "project"} onChange={(e) => updateArrayItem("portfolio", index, "category", e.target.value)} className={inputClass}>
                  <option value="project">Project</option>
                  <option value="certification">Certification</option>
                  <option value="badge">Badge</option>
                  <option value="vibe-coding">Vibe Coding</option>
                </select>
                <input value={item.title || ""} onChange={(e) => updateArrayItem("portfolio", index, "title", e.target.value)} placeholder="Title" className={inputClass} />
              </div>

              <textarea value={item.description || ""} onChange={(e) => updateArrayItem("portfolio", index, "description", e.target.value)} rows={3} placeholder="Description" className={`${inputClass} mt-3`} />

              <label className="mt-3 block space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Tags</span>
                <input value={toCSV(item.tags || [])} onChange={(e) => updatePortfolioTags(index, e.target.value)} placeholder="Azure, Terraform, DevOps" className={inputClass} />
              </label>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Links</h3>
                  <button type="button" onClick={() => addPortfolioLink(index)} className="text-sm text-accent-project">+ Add link</button>
                </div>
                {(item.links || []).map((link, linkIndex) => (
                  <div key={`${link.label || "link"}-${linkIndex}`} className="grid gap-3 md:grid-cols-[180px,1fr,auto]">
                    <input value={link.label || ""} onChange={(e) => updatePortfolioLink(index, linkIndex, "label", e.target.value)} placeholder="Label" className={inputClass} />
                    <input value={link.href || ""} onChange={(e) => updatePortfolioLink(index, linkIndex, "href", e.target.value)} placeholder="URL" className={inputClass} />
                    <button type="button" onClick={() => removePortfolioLink(index, linkIndex)} className="rounded-2xl border border-red-500/30 px-3 text-sm text-red-300">Remove</button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => removeArrayItem("portfolio", index)} className="rounded-2xl border border-red-500/30 px-3 py-2 text-sm text-red-300">Remove item</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
