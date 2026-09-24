export default function handler(req, res) {
  const hasAdminConfig = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);

  if (!hasAdminConfig) {
    return res.status(503).json({
      error: "Admin authentication is not configured. Set real environment credentials before enabling the admin login.",
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({ authenticated: false, message: "Use Supabase auth for admin access." });
  }

  if (req.method === "POST") {
    return res.status(403).json({ error: "Admin login is disabled. Use Supabase authentication only." });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ ok: true, message: "No active admin session." });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
