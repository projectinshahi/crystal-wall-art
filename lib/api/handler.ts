import { NextRequest, NextResponse } from 'next/server';

import { getAuthUser, requireAdmin } from './auth';
import { ApiError } from './errors';
import { apiResponse } from './response';
import {
    getClientIp,
    getCorsHeaders,
    isAllowedOrigin,
} from './security';
import { checkRateLimit } from './rateLimit';

export type AccessLevel = 'public' | 'user' | 'admin';

export interface RouteContext {
    req: NextRequest;
    user?: any;
    params?: Record<string, string>;
}

export type RouteHandler = (
    ctx: RouteContext
) => Promise<NextResponse>;

interface HandlerOptions {
    access?: AccessLevel;
    rateLimit?: {
        max: number;
        windowMs?: number;
    };
}

export function withHandler(
    handler: RouteHandler,
    options: HandlerOptions = {}
) {
    return async (
        req: NextRequest,
        ctx?: {
            params?: Record<string, string>;
        }
    ) => {
        const access = options.access ?? 'public';

        const origin = req.headers.get('origin');

        // OPTIONS
        if (req.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    ...getCorsHeaders(origin),
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        // CORS
        if (!isAllowedOrigin(origin)) {
            return apiResponse({ error: 'Forbidden' }, 403);
        }

        const corsHeaders = getCorsHeaders(origin);

        try {
            // Rate limit
            const ip = getClientIp(req);

            const limit = options.rateLimit?.max ?? 100;
            const windowMs = options.rateLimit?.windowMs;

            const rl = checkRateLimit(
                `${access}:${ip}`,
                limit,
                windowMs
            );

            if (!rl.allowed) {
                return apiResponse(
                    {
                        error: 'Too Many Requests',
                    },
                    429,
                    {
                        ...corsHeaders,
                        'Retry-After': String(
                            Math.ceil((rl.resetAt - Date.now()) / 1000)
                        ),
                    }
                );
            }

            // Auth
            let user;

            if (access === 'user') {
                user = await getAuthUser(req);
            }

            if (access === 'admin') {
                user = await requireAdmin(req);
            }

            // Handler
            const response = await handler({
                req,
                user,
                params: ctx?.params,
            });

            Object.entries(corsHeaders).forEach(([key, value]) => {
                response.headers.set(key, value);
            });

            return response;
        } catch (error) {
            console.error('[API ERROR]', error);

            if (error instanceof ApiError) {
                return apiResponse(
                    {
                        error: error.message,
                    },
                    error.status,
                    corsHeaders
                );
            }

            return apiResponse(
                {
                    error: 'Internal Server Error',
                },
                500,
                corsHeaders
            );
        }
    };
}

export function ok<T>(
  data: T,
  status = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

export function okList<T>(
  data: T[],
  meta: Record<string, unknown> = {},
  status = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

export function err(
  message: string,
  status = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}