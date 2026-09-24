export default function handler(req, res) {
  return res.status(503).json({
    error: "Profile data is managed exclusively through Supabase. The local fallback profile API has been disabled.",
  });
}
