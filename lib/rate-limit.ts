type RateLimitBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()

interface RateLimitOptions {
  key: string
  limit: number
  windowMs: number
}

export function enforceRateLimit({ key, limit, windowMs }: RateLimitOptions): void {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  if (existing.count >= limit) {
    throw new Error('Too many requests. Please wait a moment and try again.')
  }

  existing.count += 1
  buckets.set(key, existing)
}
