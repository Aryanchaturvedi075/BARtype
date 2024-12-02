// backend/src/middleware/errorHandler.js               --> Error handling middleware for common error types
import { z } from 'zod';

export class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err, req, res, next) => {
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors
        });
    }

    if (err instanceof ApplicationError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    console.error('Unhandled Error:', err);
    return res.status(500).json({
        error: 'Internal Server Error'
    });
};