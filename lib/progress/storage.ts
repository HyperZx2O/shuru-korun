const KEY = 'sk.v1.progress'

export function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function saveProgress(p: Record<string, boolean>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function isDone(id: string): boolean {
  return !!loadProgress()[id]
}

export function toggleDone(id: string): Record<string, boolean> {
  const p = loadProgress()
  p[id] = !p[id]
  saveProgress(p)
  return p
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}