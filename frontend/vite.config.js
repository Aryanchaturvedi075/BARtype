import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [sveltekit()],
  server: { port: 3000 },
  css: {
    // PostCSS Configuration
    postcss: {
      // Path to your PostCSS config file (e.g., postcss.config.js)
      config: "./postcss.config.js",
      plugins: [ tailwindcss ],
    },
  },
});
