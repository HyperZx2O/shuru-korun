// Best-effort per-instance token bucket.

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, perMinute: number): { ok: boolean; remaining: number } {
  const now = Date.now()
  const windowMs = 60_000
  // Evict expired buckets so the map cannot grow without bound.
  for (const [k, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(k)
  }
  let b = buckets.get(key)
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs }
    buckets.set(key, b)
  }
  if (b.count >= perMinute) {
    return { ok: false, remaining: 0 }
  }
  b.count += 1
  return { ok: true, remaining: perMinute - b.count }
}