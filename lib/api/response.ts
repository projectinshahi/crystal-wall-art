import { NextResponse } from 'next/server';
import { SECURITY_HEADERS } from './security';

export function apiResponse(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(data, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...headers,
    },
  });
}