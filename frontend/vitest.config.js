// frontend/vitest.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte({ hot: !process.env.VITEST })],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.js'],
        deps: {
            inline: [/^svelte/]
        }
    },
});