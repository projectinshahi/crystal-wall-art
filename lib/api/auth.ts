import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from './errors';

export async function getAuthUser(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  return token;
}

export async function requireAdmin(req: NextRequest) {
  const user = await getAuthUser(req);

  if (user.role?.name !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }

  return user;
}