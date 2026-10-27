import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works from any hosting path (GitHub Pages, S3, Netlify).
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 3000 },
});
