import { ok, withHandler } from '@/lib/api/handler';
import { checkDbConnection } from '@/lib/db';

export const GET = withHandler(
  async () => {
    const db = await checkDbConnection();

    const healthy = db.reader && db.writer;

    const response = ok(
      {
        status: healthy ? 'ok' : 'degraded',
        db,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? '1.0.0',
      },
      healthy ? 200 : 503
    );

    // Never cache health checks
    response.headers.set('Cache-Control', 'no-store');

    return response;
  },
  {
    access: 'public',
  }
);