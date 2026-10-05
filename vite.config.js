import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 runs as a Vite plugin, not a PostCSS plugin.
// All theme tokens live in src/styles/index.css under @theme — there is no
// tailwind.config.js anymore, and there should never be one again.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true, // <-- Automatically opens the project in your default browser
  },
  resolve: {
    alias: {
      // "@/components/..." → "src/components/..."
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});