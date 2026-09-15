import 'server-only'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Fixed-window, in-memory rate limiter. Adequate for a single server instance;
 * swap for Redis/Upstash when running multiple instances behind a load balancer.
 */
export const rateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    }
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  bucket.count += 1
  return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt }
}

export const clientKey = (headers: Headers) => {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip') || 'unknown'
}
