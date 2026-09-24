import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profilePath = path.join(__dirname, "..", "src", "data", "profile.json");

async function readProfile() {
  try {
    const file = await readFile(profilePath, "utf8");
    return JSON.parse(file);
  } catch {
    const fallback = await import("../src/data/profile.js");
    return fallback.default;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      return res.status(200).json(await readProfile());
    } catch (error) {
      return res.status(500).json({ error: error.message || "Unable to load profile." });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Profile payload is required." });
      }

      await writeFile(profilePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
      return res.status(200).json({ ok: true, message: "Profile updated successfully." });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Unable to save profile." });
    }
  }

  res.setHeader("Allow", "GET, PUT, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}
