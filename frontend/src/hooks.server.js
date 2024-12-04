// frontend/src/hooks.server.js
export async function handle({ event, resolve }) {
  // Set API URLs based on environment
  event.locals.api = {
    baseUrl: process.env.PUBLIC_BACKEND_URL ?? "http://localhost:3001",
    wsUrl: process.env.PUBLIC_WS_URL ?? "ws://localhost:3002",
  };
  
  // If this is an API request, let it pass through to the proxy
  if (event.url.pathname.startsWith('/api')) {
    return await resolve(event);
  }

  return await resolve(event);
}
