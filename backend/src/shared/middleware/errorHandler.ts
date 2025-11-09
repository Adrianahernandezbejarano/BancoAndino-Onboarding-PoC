import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { HttpError } from '../errors/HttpError';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  errors?: unknown;
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const isHttpError = err instanceof HttpError;
  const isValidationError = Array.isArray(err.errors);
  const baseMessage = err.message || 'Internal Server Error';

  logger.error({
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  const errorPayload = isValidationError
    ? {
        message: 'Datos inválidos',
        details: err.errors,
      }
    : {
        message: baseMessage,
      };

  res.status(statusCode).json({
    success: false,
    error: {
      ...errorPayload,
      ...(process.env.NODE_ENV === 'development' && !isHttpError && { stack: err.stack }),
    },
  });
};
