import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local development, `npm run dev` serves only the frontend on
// e.g. http://localhost:5173. The proxy below forwards any request the
// frontend makes to /api/* to `vercel dev` (which runs the serverless
// functions locally on port 3000), so fetch("/api/...") works the same
// way in local dev as it does once deployed to Vercel.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
