import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { AppError, handleError } from '../utils/error-handler';

type ApiHandler = (
  req: NextRequest,
  params: { params: Record<string, string> }
) => Promise<NextResponse>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRouteHandlers {
  GET?: ApiHandler;
  POST?: ApiHandler;
  PUT?: ApiHandler;
  PATCH?: ApiHandler;
  DELETE?: ApiHandler;
}

/**
 * Creates an API route handler with method-based routing and error handling
 */
export function createApiRoute(handlers: ApiRouteHandlers) {
  return async function handler(
    req: NextRequest,
    params: { params: Record<string, string> }
  ) {
    try {
      const method = req.method as HttpMethod;
      const handler = handlers[method];

      if (!handler) {
        return NextResponse.json(
          { success: false, message: `Method ${method} Not Allowed` },
          { status: 405 }
        );
      }

      return await handler(req, params);
    } catch (error) {
      const errorResponse = handleError(error);
      return NextResponse.json(errorResponse, {
        status: errorResponse.status || 500
      });
    }
  };
}

/**
 * Validates request body against a Zod schema
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    throw new AppError('Invalid request body', 400);
  }
}

/**
 * Parses and validates query parameters
 */
export function parseQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  try {
    const url = new URL(req.url);
    const queryObj: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    return schema.parse(queryObj);
  } catch (error) {
    throw new AppError('Invalid query parameters', 400);
  }
}

/**
 * Creates a successful response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Creates an error response
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}
