// frontend/src/hooks.server.js
export async function handle({ event, resolve }) {
    // Set API URLs based on environment
    event.locals.api = {
        baseUrl: process.env.PUBLIC_BACKEND_URL ?? 'http://localhost:3001',
        wsUrl: process.env.PUBLIC_WS_URL ?? 'ws://localhost:3002'
    };
    
    return await resolve(event);
}