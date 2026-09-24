# Portfolio — Emmanuel A. Idoga

A dev-portfolio site (sidebar profile card, tabbed nav, filterable
project/certification/badge grid) built with React + Vite + Tailwind on
the frontend, and Vercel serverless functions (`/api`) as the backend.
Both deploy together as **one Vercel project** — no second project, no
separate domain to wire up for the API.

## 1. Add the real content

I can't reach LinkedIn profile pages directly (they require being logged
in), so everything here is still placeholder content. It all comes from
one file:

```
src/data/profile.js
```

Fill in: name, title, location, availability, About text, stats,
skills, experience, education, journey milestones, blog posts, and the
`portfolio` array (projects / certifications / badges / vibe-coding
items — each needs a `category`, `title`, `description`, `tags`, and
`links`). Nothing else in the code needs to change.

Paste the LinkedIn profile text here (or upload a PDF export — "More →
Save to PDF" on LinkedIn) and I'll fill this file in directly.

Drop a real headshot at `public/avatar.jpg` and swap the initials circle
in `src/components/Sidebar.jsx` for an `<img>` if you'd rather not use
initials. Same for a resume file at `public/resume.pdf` — the Download
CV buttons already point at `/resume.pdf`.

## 2. Run it locally

```bash
npm install
npm install -g vercel   # once, for local API routes
vercel dev              # runs both frontend and /api together on :3000
```

`vercel dev` runs the `/api` serverless functions exactly as Vercel will
in production, alongside the Vite frontend. Plain `npm run dev` also
works for frontend-only work — `vite.config.js` proxies `/api` requests
to port 3000, so keep `vercel dev` running alongside it if you use this.

## 3. Deploy to Vercel as a single project

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import that repo.
3. Vercel auto-detects the Vite frontend (`vercel.json` pins the build
   command and output directory) and auto-detects everything in `/api`
   as serverless functions — one project, one deploy, one domain.
4. Click Deploy.

No API-URL environment variable is needed: the frontend calls the API
with a relative path (`fetch("/api/contact")`), which resolves against
the same domain in both dev and production.

## How the frontend and backend talk to each other

- `GET /api/profile` (`api/profile.js`) returns the profile JSON. The
  frontend (`src/App.jsx`) fetches it on load and falls back to the
  local `src/data/profile.js` import if the request fails.
- `POST /api/contact` (`api/contact.js`) receives the Contact tab's form
  submission, validates it, and logs it to the Vercel function logs for
  now — swap the `console.log` for a real email provider (e.g.
  [Resend](https://resend.com)) when ready, with the API key set as an
  environment variable in the Vercel project settings.

## Structure

```
├── api/
│   ├── profile.js        # GET  /api/profile
│   └── contact.js        # POST /api/contact
├── src/
│   ├── data/
│   │   ├── profile.js    # ← all real content goes here
│   │   └── categories.js # tab list + portfolio category colors/labels
│   ├── components/
│   │   ├── Sidebar.jsx   # avatar, availability, CV download, contact icons
│   │   ├── TabNav.jsx    # About / Portfolio / Resume / Journey / Blog / Contact / Terminal
│   │   ├── Portfolio.jsx # filter pills + search + card grid
│   │   ├── Card.jsx      # one project/certification/badge card
│   │   ├── About.jsx, Resume.jsx, Journey.jsx, Blog.jsx, Contact.jsx, Terminal.jsx
│   │   └── icons.jsx     # inline SVG icon set (no external icon library)
│   ├── App.jsx            # layout + tab switching + theme toggle + backend fetch
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## Design notes

Category color-coding (cyan = projects, amber = certifications, violet
= badges, lime = vibe-coding) is used consistently across the filter
pills, card accents, and tags instead of relying on mismatched
screenshots — it doubles as a legend, so the grid reads clearly even
before there's real imagery. Monospace type is reserved for tags,
labels, and the Terminal tab, in keeping with the subject matter; body
and headings use a plain grotesque sans. Dark mode is the default,
toggleable from the sidebar (persisted in `localStorage`).
