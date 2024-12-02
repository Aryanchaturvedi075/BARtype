// frontend/src/hooks.server.js             --> SvelteKit configurations for Optimal SSR performance
export async function handle({ event, resolve }) {
    event.locals.apiBaseUrl = process.env.PUBLIC_BACKEND_URL;
    event.locals.wsUrl = process.env.PUBLIC_WS_URL;
    return resolve(event);
}