import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from './errors';
import { ADMIN_SESSION_COOKIE, CUSTOMER_SESSION_COOKIE } from '@/lib/auth-cookies';

// Customer (storefront) session
export async function getAuthUser(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: CUSTOMER_SESSION_COOKIE,
  });

  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  return token;
}

// Admin session (separate cookie from the customer session)
export async function requireAdmin(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: ADMIN_SESSION_COOKIE,
  });

  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (user.role?.name !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }

  return user;
}
