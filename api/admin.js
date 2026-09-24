const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...rest] = cookie.split("=");
        return [name, decodeURIComponent(rest.join("="))];
      })
  );
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const username = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  const sessionCookie = cookies.admin_session;
  const userCookie = cookies.admin_user;

  return sessionCookie === "authenticated" && userCookie === username;
}

export default function handler(req, res) {
  const username = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

  if (req.method === "GET") {
    return res.status(200).json({ authenticated: isAuthenticated(req) });
  }

  if (req.method === "POST") {
    const { username: submittedUsername, password: submittedPassword } = req.body || {};

    if (submittedUsername === username && submittedPassword === password) {
      res.setHeader(
        "Set-Cookie",
        [
          `admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
          `admin_user=${encodeURIComponent(username)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        ]
      );

      return res.status(200).json({ ok: true, message: "Authenticated." });
    }

    return res.status(401).json({ error: "Invalid admin credentials." });
  }

  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      [
        "admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
        "admin_user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
      ]
    );
    return res.status(200).json({ ok: true, message: "Logged out." });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
