import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [sveltekit()],
  server: { 
    port: 3000,
    proxy: {
      '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
      }
    }
  },
  css: {
    // PostCSS Configuration
    postcss: {
      // Path to your PostCSS config file (e.g., postcss.config.js)
      config: "./postcss.config.js",
      plugins: [ tailwindcss ],
    },
  },
});
