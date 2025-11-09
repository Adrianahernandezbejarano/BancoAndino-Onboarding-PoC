export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class GoneError extends HttpError {
  constructor(message: string) {
    super(message, 410);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message: string) {
    super(message, 429);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}
