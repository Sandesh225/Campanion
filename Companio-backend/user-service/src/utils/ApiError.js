// src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request", errors = []) {
    super(400, message, errors);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", errors = []) {
    super(401, message, errors);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", errors = []) {
    super(403, message, errors);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found", errors = []) {
    super(404, message, errors);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict", errors = []) {
    super(409, message, errors);
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
