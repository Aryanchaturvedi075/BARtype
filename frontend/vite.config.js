import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: './postcss.config.js', // Ensures PostCSS is used
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
