// backend/src/routes/typing.js                     --> Creating the Rest API endpoints for the typing service
import { Router } from 'express';
import { z } from 'zod';

export function createTypingRoutes(textService, metricsService) {
    const router = Router();

    router.post('/sessions', async (req, res) => {
        try {
            const session = await textService.generateSession(req.body);
            res.json(session);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.get('/sessions/:sessionId/metrics', async (req, res) => {
        try {
            const metrics = await metricsService.getMetrics(req.params.sessionId);
            res.json(metrics);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router;
}