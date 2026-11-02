// In-memory LRU answer cache.

type Entry = { value: string; expires: number }
const store = new Map<string, Entry>()
const MAX = 200
const TTL = 6 * 60 * 60 * 1000

export function cacheKey(q: string, stepId?: string, locale?: string): string {
  return `${locale ?? 'bn'}::${stepId ?? ''}::${q.trim().toLowerCase()}`
}

export function cacheGet(key: string): string | null {
  const e = store.get(key)
  if (!e) return null
  if (Date.now() > e.expires) {
    store.delete(key)
    return null
  }
  // touch
  store.delete(key)
  store.set(key, e)
  return e.value
}

export function cacheSet(key: string, value: string): void {
  if (store.size >= MAX) {
    const first = store.keys().next().value
    if (first) store.delete(first)
  }
  store.set(key, { value, expires: Date.now() + TTL })
}