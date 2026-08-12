export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, errorCode: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, errorCode = "BAD_REQUEST", details?: unknown) {
    return new AppError(400, message, errorCode, details);
  }

  static unauthorized(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    return new AppError(401, message, errorCode);
  }

  static forbidden(message = "Forbidden", errorCode = "FORBIDDEN") {
    return new AppError(403, message, errorCode);
  }

  static notFound(message = "Resource not found", errorCode = "NOT_FOUND") {
    return new AppError(404, message, errorCode);
  }

  static conflict(message: string, errorCode = "CONFLICT") {
    return new AppError(409, message, errorCode);
  }

  static validation(message: string, details?: unknown) {
    return new AppError(422, message, "VALIDATION_ERROR", details);
  }

  static internal(message = "Internal server error") {
    return new AppError(500, message, "INTERNAL_ERROR");
  }
}
