// POST /api/contact — handles the contact form submission from
// src/components/Contact.jsx. This runs as a Vercel serverless function
// in the same project/deployment as the frontend, so no separate backend
// project or extra CORS setup is needed.
//
// Right now it just validates the input and logs it (visible in the
// Vercel function logs). Wire it up to an email service to make it send
// real email — e.g. Resend (https://resend.com) or Nodemailer with an
// SMTP provider. Add your API key as an environment variable in the
// Vercel project settings (never commit it to the repo).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are all required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  // TODO: send this via an email provider instead of just logging it.
  console.log("New portfolio contact form submission:", { name, email, message });

  return res.status(200).json({ ok: true });
}
