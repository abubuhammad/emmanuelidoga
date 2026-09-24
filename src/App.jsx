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
import { supabase, supabaseEnabled } from "./lib/supabase.js";

const emptyProfile = {
  name: "",
  title: "",
  location: "",
  available: true,
  availabilityNote: "",
  email: "",
  resumeUrl: "",
  social: { linkedin: "", github: "", twitter: "" },
  about: "",
  stats: [],
  skills: [],
  experience: [],
  education: [],
  journey: [],
  blog: [],
  portfolio: [],
};

const databaseSeedProfile = {
  name: "Emmanuel A. Idoga",
  title: "Azure Cloud & DevOps Engineer",
  location: "Abuja, Federal Capital Territory, Nigeria",
  available: true,
  availabilityNote: "Open to remote and hybrid roles",
  email: "hello@emmanuelidoga.com",
  resumeUrl: "",
  social: {
    linkedin: "https://www.linkedin.com/in/emmanuel-a-idoga",
    github: "",
    twitter: "",
  },
  about:
    "I'm an Azure Cloud & DevOps Engineer with hands-on experience administering Microsoft Azure environments and building secure, scalable cloud infrastructure. Since 2024, I've worked as an Azure Administrator at Arodonna ICT Arena, gaining practical experience across Azure infrastructure, identity and access management, storage, compute, and cloud operations. My technical focus spans Azure infrastructure (VMs, VM Scale Sets, storage, load balancing), networking (VNets, subnets, NSGs, VNet peering and private connectivity), identity & security (Entra ID, Azure RBAC, managed identities), automation & infrastructure as code (Azure CLI, Terraform), DevOps (Git, GitHub Actions, CI/CD), and containers (Docker, Kubernetes). I also enjoy technical writing — translating complex cloud engineering concepts into practical, easy-to-follow guides. I'm interested in opportunities across Azure Engineering, Azure Administration, Cloud Infrastructure, DevOps, Cloud Operations and Infrastructure Automation. Let's connect.",
  stats: [
    { label: "Years in cloud/DevOps", value: "2+" },
    { label: "Certifications", value: "4" },
    { label: "Connections", value: "400+" },
  ],
  skills: ["Microsoft Azure", "Docker", "Terraform"],
  experience: [
    {
      role: "Cloud Administrator",
      company: "Arodonna ICT Arena · Contract",
      period: "Aug 2024 — Present · 2 yrs 2 mos",
      location: "Hybrid",
      summary: "Azure Administration & Cloud Infrastructure — the full description was cut off in the screenshot, add the rest from LinkedIn.",
    },
    {
      role: "Azure Practitioner — Personal Projects",
      company: "Independent Projects / Azure Labs",
      period: "Aug 2022 — Present · 4 yrs 2 mos",
      location: "Nigeria",
      summary: "Independent, hands-on Azure labs and personal projects across infrastructure, networking, identity, and automation.",
    },
  ],
  education: [
    {
      school: "Federal University of Technology Minna",
      degree: "Degree / field of study not shown in the screenshot — add it here. Skills tagged: Terraform, Docker, +1 more.",
      period: "",
    },
  ],
  journey: [
    {
      year: "2022",
      title: "Started hands-on Azure practice",
      description: "Began independent Azure labs and personal projects — infrastructure, networking, identity, and automation.",
    },
    {
      year: "2024",
      title: "Became Cloud Administrator",
      description: "Joined Arodonna ICT Arena as Cloud Administrator (contract), working across Azure administration and cloud infrastructure.",
    },
    {
      year: "2025",
      title: "Microsoft certified",
      description: "Earned Microsoft Certified: Azure Fundamentals, Azure Data Fundamentals, and Azure Administrator Associate (AZ-104). Currently pursuing AZ-400 (DevOps Engineer Expert).",
    },
  ],
  blog: [
    {
      title: "Building a Full-Stack Cloud App on Azure",
      excerpt: "I just finished building a full-stack, serverless app on Azure — and wanted to share why the interesting part wasn't the finished product.",
      href: "#",
      date: "LinkedIn post",
    },
    {
      title: "I stopped deploying my Azure app by hand",
      excerpt: "Rebuilt a serverless three-tier Student Registration Portal as ARM templates — SQL, a serverless database, Storage, and Functions all defined as code instead of clicked together by hand, so anyone can reproduce it.",
      href: "#",
      date: "LinkedIn post",
    },
  ],
  portfolio: [
    {
      id: "featured-arm-deploy",
      category: "project",
      title: "Automatically Deploy a Complete Azure App",
      description: "A serverless three-tier app (SQL, serverless database, Storage, Functions) deployed entirely via ARM templates instead of manual clicks in the Azure Portal — fully reproducible infrastructure as code.",
      tags: ["Azure", "ARM Templates", "IaC"],
      links: [{ label: "Read article", href: "#" }],
    },
    {
      id: "featured-linux-scaling-1",
      category: "project",
      title: "Scaling Linux Infrastructure on Azure",
      description: "Featured Medium article — the title was cut off in the LinkedIn screenshot. Add the full title and link here.",
      tags: ["Azure", "Linux"],
      links: [{ label: "Read article", href: "#" }],
    },
    {
      id: "cert-az104",
      category: "certification",
      title: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
      description: "Issued by Microsoft. Credential ID and date not shown in the screenshot — add from \"Show all 4 licenses\" on LinkedIn.",
      tags: ["Azure"],
      links: [{ label: "Show credential", href: "#" }],
    },
  ],
};

export default function App() {
  const [profile, setProfile] = useState(emptyProfile);
  const [tab, setTab] = useState("Portfolio");
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const saveProfile = async (nextProfile) => {
    if (!supabaseEnabled || !supabase) {
      throw new Error("Supabase is required for profile persistence. Configure the database before saving.");
    }

    const sanitizedProfile = { ...emptyProfile, ...nextProfile };
    const { data, error } = await supabase
      .from("profiles")
      .upsert([{ id: "portfolio", content: sanitizedProfile }], { onConflict: "id" })
      .select("id, content")
      .single();

    if (error) {
      throw new Error(error.message || "Unable to save profile to Supabase.");
    }

    const savedProfile = { ...emptyProfile, ...(data?.content || sanitizedProfile) };
    setProfile(savedProfile);
    return savedProfile;
  };

  const checkAdminStatus = async () => {
    if (!supabaseEnabled || !supabase) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      setIsAdmin(Boolean(data.session));
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (supabaseEnabled && supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      setIsAdmin(false);
      setTab("Portfolio");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (supabaseEnabled && supabase) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, content")
            .eq("id", "portfolio")
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (data?.content) {
            if (!cancelled) {
              setProfile({ ...emptyProfile, ...(data.content || {}) });
            }
          } else {
            const seeded = await supabase
              .from("profiles")
              .upsert([{ id: "portfolio", content: databaseSeedProfile }], { onConflict: "id" })
              .select("id, content")
              .single();

            if (!cancelled && !seeded.error && seeded.data?.content) {
              setProfile({ ...emptyProfile, ...(seeded.data.content || {}) });
            }
          }
        } catch {
          if (!cancelled) setProfile(emptyProfile);
        }

        checkAdminStatus();
        return;
      }

      setProfile(emptyProfile);
      checkAdminStatus();
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

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
