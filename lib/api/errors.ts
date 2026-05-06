export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}