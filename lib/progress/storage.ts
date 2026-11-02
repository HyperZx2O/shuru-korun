import type { Intake } from '@/lib/rules/types'

const KEY = 'sk.v1.progress'
const CHECKLIST_KEY = 'sk.v1.checklist'
const NA_KEY = 'sk.v1.na'
const INTAKE_KEY = 'sk.v1.intake'
const ASK_KEY = 'sk.v1.askHistory'

export type NaEntry = { na: boolean; reason: string }
export type Checklist = Record<string, Record<number, boolean>>
export type NaMap = Record<string, NaEntry>
export type AskMsg = { role: 'user' | 'assistant'; text: string; sources?: { name: string; url: string }[] }

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// --- done tracking ---
export function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  return safeParse<Record<string, boolean>>(localStorage.getItem(KEY), {})
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

// --- document checklist ---
export function loadChecklist(): Checklist {
  if (typeof window === 'undefined') return {}
  return safeParse<Checklist>(localStorage.getItem(CHECKLIST_KEY), {})
}
export function saveChecklist(c: Checklist): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(c))
}
export function isDocDone(stepId: string, docIndex: number): boolean {
  return !!loadChecklist()[stepId]?.[docIndex]
}
export function toggleDocDone(stepId: string, docIndex: number): boolean {
  const c = loadChecklist()
  if (!c[stepId]) c[stepId] = {}
  c[stepId][docIndex] = !c[stepId][docIndex]
  saveChecklist(c)
  return c[stepId][docIndex]
}
export function resetChecklist(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CHECKLIST_KEY)
}

// --- not applicable ---
export function loadNA(): NaMap {
  if (typeof window === 'undefined') return {}
  return safeParse<NaMap>(localStorage.getItem(NA_KEY), {})
}
export function saveNA(m: NaMap): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(NA_KEY, JSON.stringify(m))
}
export function isNA(id: string): boolean {
  return !!loadNA()[id]?.na
}
export function getNAReason(id: string): string {
  return loadNA()[id]?.reason ?? ''
}
export function setNA(id: string, na: boolean, reason: string): NaMap {
  const m = loadNA()
  if (na) m[id] = { na: true, reason: reason.trim() }
  else delete m[id]
  saveNA(m)
  return m
}
export function resetNA(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(NA_KEY)
}

// --- intake answers ---
export function loadIntake(): Intake | null {
  if (typeof window === 'undefined') return null
  return safeParse<Intake | null>(localStorage.getItem(INTAKE_KEY), null)
}
export function saveIntake(intake: Intake): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(INTAKE_KEY, JSON.stringify(intake))
}
export function clearIntake(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(INTAKE_KEY)
}

// --- ask shuru history ---
export function loadAskHistory(): AskMsg[] {
  if (typeof window === 'undefined') return []
  return safeParse<AskMsg[]>(localStorage.getItem(ASK_KEY), [])
}
export function saveAskHistory(msgs: AskMsg[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ASK_KEY, JSON.stringify(msgs))
}
export function clearAskHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ASK_KEY)
}

// --- export / import ---
export type ExportBundle = {
  version: 1
  exportedAt: string
  progress: Record<string, boolean>
  checklist: Checklist
  na: NaMap
  intake: Intake | null
  askHistory: AskMsg[]
}

export function exportProgress(): string {
  const bundle: ExportBundle = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
    checklist: loadChecklist(),
    na: loadNA(),
    intake: loadIntake(),
    askHistory: loadAskHistory(),
  }
  return JSON.stringify(bundle, null, 2)
}

export function importProgress(json: string): boolean {
  try {
    const b = JSON.parse(json) as Partial<ExportBundle>
    if (b.progress && typeof b.progress === 'object') saveProgress(b.progress as Record<string, boolean>)
    if (b.checklist && typeof b.checklist === 'object') saveChecklist(b.checklist as Checklist)
    if (b.na && typeof b.na === 'object') saveNA(b.na as NaMap)
    if (b.intake && typeof b.intake === 'object') saveIntake(b.intake as Intake)
    if (Array.isArray(b.askHistory)) saveAskHistory(b.askHistory as AskMsg[])
    return true
  } catch {
    return false
  }
}

export function resetAll(): void {
  if (typeof window === 'undefined') return
  resetProgress()
  resetChecklist()
  resetNA()
  clearIntake()
  clearAskHistory()
}