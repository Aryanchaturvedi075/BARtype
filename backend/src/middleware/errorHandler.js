import { ZodError } from "zod";

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }
}

export function errorHandler(error, request, reply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      errorCode: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: error.errors,
      timestamp: new Date().toISOString(),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      timestamp: error.timestamp,
    });
  }

  // Handle unexpected errors
  console.error("Unhandled error:", error);
  return reply.status(500).send({
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
  });
}
