import { Pool, PoolClient } from 'pg';

// ---------------------------------------------------------------------------
// Prevent pool recreation on hot reload in dev
// ---------------------------------------------------------------------------
const globalForDb = global as unknown as {
  readPool: Pool | undefined;
  writePool: Pool | undefined;
};

// ---------------------------------------------------------------------------
// SSL config — handles DigitalOcean self-signed CA
// ---------------------------------------------------------------------------
function buildSslConfig(): object | false {
  const cert = process.env.DB_SSL_CERT;

  if (!cert) {
    return process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false;
  }

  const ca = cert
    .replace(/\\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .trim();

  return {
    rejectUnauthorized: false,
    ca,
  };
}

const sslConfig = buildSslConfig();

const sharedConfig = {
  host:                    process.env.DB_HOST,
  port:                    Number(process.env.DB_PORT) || 25060,
  database:                process.env.DB_NAME,
  ssl:                     sslConfig,
  idleTimeoutMillis:       30_000,
  connectionTimeoutMillis: 15_000, // ✅ increased from 5s
  statement_timeout:       20_000, // ✅ increased from 10s
  query_timeout:           20_000, // ✅ increased from 10s
  allowExitOnIdle:         true,
};

// ---------------------------------------------------------------------------
// Pools — reused across hot reloads in dev
// ---------------------------------------------------------------------------
export const readPool = globalForDb.readPool ?? new Pool({
  ...sharedConfig,
  user:     process.env.APP_READER_DB_USER,
  password: process.env.APP_READER_DB_PASSWORD,
  max: 20,
});

export const writePool = globalForDb.writePool ?? new Pool({
  ...sharedConfig,
  user:     process.env.APP_WRITER_DB_USER,
  password: process.env.APP_WRITER_DB_PASSWORD,
  max: 10,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.readPool  = readPool;
  globalForDb.writePool = writePool;
}

readPool.on('error',  (err) => console.error('[DB readPool error]',  err));
writePool.on('error', (err) => console.error('[DB writePool error]', err));

// Graceful shutdown
async function shutdown() {
  await Promise.allSettled([readPool.end(), writePool.end()]);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------
export async function readQuery<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  return runQuery<T>(readPool, text, params);
}

export async function writeQuery<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  return runQuery<T>(writePool, text, params);
}

async function runQuery<T>(
  pool: Pool,
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now();
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    const res = await client.query(text, params);
    const ms = Date.now() - start;
    if (ms > 3000) console.warn(`[DB] Slow query (${ms}ms):`, text.slice(0, 120));
    return res.rows as T[];
  } catch (err) {
    console.error('[DB] Query error:', err);
    throw err;
  } finally {
    client?.release();
  }
}

// ---------------------------------------------------------------------------
// Transaction helper
// ---------------------------------------------------------------------------
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await writePool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// RLS session helper
// ---------------------------------------------------------------------------
export async function withUserSession<T>(
  userId: number,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await writePool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL app.current_user_id = $1', [String(userId)]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
export async function checkDbConnection(): Promise<{
  reader: boolean;
  writer: boolean;
}> {
  const check = async (pool: Pool): Promise<boolean> => {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  };

  const [reader, writer] = await Promise.all([
    check(readPool),
    check(writePool),
  ]);

  return { reader, writer };
}