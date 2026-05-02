const rateLimitMap = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs = 60_000
) {
  const now = Date.now();

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetAt) {
    const resetAt = now + windowMs;

    rateLimitMap.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: max - 1,
      resetAt,
    };
  }

  if (current.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;

  return {
    allowed: true,
    remaining: max - current.count,
    resetAt: current.resetAt,
  };
}