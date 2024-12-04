// backend/index.js
import fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import {
  CONFIG, errorHandler, apiRoutes, WSServer, StateManager, TextGenerator,
  TextAnalyzer, MetricsCalculator, TypingHandler, WebSocketErrorHandler
} from './src/index.js';

async function buildApp() {
  const app = fastify({
    logger: {
      level: CONFIG.isDevelopment ? "debug" : "info",
    },
  });

  // Initialize core services
  const stateManager = new StateManager();
  const textGenerator = new TextGenerator();
  const textAnalyzer = new TextAnalyzer();
  const metricsCalculator = new MetricsCalculator();

  // Register services with fastify instance
  app.decorate("stateManager", stateManager);
  app.decorate("textGenerator", textGenerator);
  app.decorate("textAnalyzer", textAnalyzer);
  app.decorate("metricsCalculator", metricsCalculator);

  // Register plugins
  await app.register(cors, {
    origin: CONFIG.CORS_ORIGIN,
    methods: ["GET", "POST"],
  });

  await app.register(websocket, {
    options: {
      port: CONFIG.WS_PORT || 3002,
      server: false,  // Explicitly set to false since we're using port
      noServer: false // Explicitly set to false since we're using port
    },
  });

  // Initialize WebSocket handlers
  const typingHandler = new TypingHandler(
    stateManager,
    textAnalyzer,
    metricsCalculator,
  );
  const wsErrorHandler = new WebSocketErrorHandler(stateManager);
  const wsServer = new WSServer(stateManager, typingHandler, wsErrorHandler);

  // Register WebSocket handler
  wsServer.initialize(app);

  // Register routes
  await app.register(apiRoutes);

  // Register error handler
  app.setErrorHandler(errorHandler);

  return app;
}

async function startServer() {
  try {
    const app = await buildApp();
    await app.listen({ port: CONFIG.PORT, host: "0.0.0.0" });
    console.log(`Server running on port ${CONFIG.PORT}`);
    console.log(`WebSocket server running on port ${CONFIG.WS_PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

export { buildApp }; // For testing purposes
