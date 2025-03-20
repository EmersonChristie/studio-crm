/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status = 400,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Creates an unauthorized error
 */
export function createUnauthorizedError(
  message = 'Unauthorized access'
): AppError {
  return new AppError(message, 401);
}

/**
 * Creates a not found error
 */
export function createNotFoundError(entity = 'Resource'): AppError {
  return new AppError(`${entity} not found`, 404);
}

/**
 * Creates a validation error
 */
export function createValidationError(
  errors: Record<string, string[]>,
  message = 'Validation failed'
): AppError {
  return new AppError(message, 422, errors);
}

/**
 * Creates a forbidden error
 */
export function createForbiddenError(message = 'Access forbidden'): AppError {
  return new AppError(message, 403);
}

/**
 * Creates a server error
 */
export function createServerError(message = 'Internal server error'): AppError {
  return new AppError(message, 500);
}

/**
 * Handles errors in a consistent way
 */
export function handleError(error: unknown): ErrorResponse {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      errors: error.errors,
      status: error.status
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      status: 400
    };
  }

  return {
    success: false,
    message: 'An unexpected error occurred',
    status: 500
  };
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data?: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message
  };
}
