import { err, ok, withHandler } from '@/lib/api/handler';
import { getUserByEmail } from '@/lib/db/repositories/public/user.public.repository';
import { updateUserPassword } from '@/lib/db/repositories/user/account.user.repository';
import { validateEmail, validatePassword } from '@/lib/validation';
import { hashPassword } from '@/lib/hash';
import { NextResponse } from 'next/server';

export const POST = withHandler(
  async ({ req }): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const email = String(body.email || '').trim().toLowerCase();
      const newPassword = String(body.new_password || '');
      const confirmPassword = String(body.confirm_password || '');

      validateEmail(email);
      validatePassword(newPassword);

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const users = await getUserByEmail(email);
      const user = users?.[0];

      if (!user?.id) {
        throw new Error('No account found for this email');
      }

      const passwordHash = await hashPassword(newPassword);
      const updated = await updateUserPassword(user.id, passwordHash);

      if (!updated) {
        throw new Error('Unable to reset password');
      }

      const response = ok({ message: 'Password reset successfully' });
      response.headers.set('Cache-Control', 'no-store');
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      return err(
        error instanceof Error ? error.message : 'Failed to reset password',
        400
      );
    }
  },
  { access: 'public' }
);
