import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [sveltekit()],
  server: { 
    port: 3000,
    proxy: {
      '/api': {
          target: 'http://127.0.0.1:3001', // Use 127.0.0.1 instead of localhost
          changeOrigin: true,
          secure: false,
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
