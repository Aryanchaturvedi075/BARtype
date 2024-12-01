import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: process.env.VITE_PORT
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
