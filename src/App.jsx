import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TabNav from "./components/TabNav.jsx";
import About from "./components/About.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Resume from "./components/Resume.jsx";
import Journey from "./components/Journey.jsx";
import Blog from "./components/Blog.jsx";
import Contact from "./components/Contact.jsx";
import Terminal from "./components/Terminal.jsx";
import Admin from "./components/Admin.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Footer from "./components/Footer.jsx";
import localProfile from "./data/profile.js";

export default function App() {
  const [profile, setProfile] = useState(localProfile);
  const [tab, setTab] = useState("Portfolio");
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const saveProfile = async (nextProfile) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProfile),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Unable to save profile.");
    }

    setProfile(nextProfile);
    return data;
  };

  const checkAdminStatus = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json().catch(() => ({ authenticated: false }));
      setIsAdmin(Boolean(data.authenticated));
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin", { method: "DELETE" });
    } finally {
      setIsAdmin(false);
      setTab("Portfolio");
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {});

    checkAdminStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (checkingAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Checking admin access…</div>;
  }

  const content = (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <div className="space-y-4">
          <Sidebar profile={profile} theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
          <TabNav active={tab} onChange={setTab} />
        </div>

        <main className="min-w-0">
          {tab === "About" && <About profile={profile} />}
          {tab === "Portfolio" && <Portfolio title={`${profile.title} Portfolio.`} items={profile.portfolio} />}
          {tab === "Resume" && <Resume profile={profile} />}
          {tab === "Journey" && <Journey items={profile.journey} />}
          {tab === "Blog" && <Blog posts={profile.blog} />}
          {tab === "Contact" && <Contact profile={profile} />}
          {tab === "Terminal" && <Terminal profile={profile} />}
          {tab === "Admin" && (
            isAdmin ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={handleLogout} className="rounded-full border border-red-500/40 px-4 py-2 text-sm text-red-300">Log out</button>
                </div>
                <Admin profile={profile} onSave={saveProfile} />
              </div>
            ) : (
              <AdminLogin onLogin={() => { setIsAdmin(true); setTab("Admin"); }} />
            )
          )}
        </main>
      </div>
      <Footer name={profile.name} />
    </div>
  );

  return content;
}
