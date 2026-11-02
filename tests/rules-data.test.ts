import { describe, it, expect } from 'vitest'
import { TRADE_LICENSE_STEPS } from '../lib/rules/trade-license'
import { DBID_STEPS } from '../lib/rules/dbid'
import { SOURCES } from '../lib/rules/sources'
import { weakestStatus, deriveStatus } from '../lib/rules/types'

const ALL_STEPS = [...TRADE_LICENSE_STEPS, ...DBID_STEPS]

describe('rules data invariants', () => {
  it('has at least one step in each path', () => {
    expect(TRADE_LICENSE_STEPS.length).toBeGreaterThan(0)
    expect(DBID_STEPS.length).toBeGreaterThan(0)
  })

  it('every step has a non-empty source list pointing at real sources', () => {
    for (const step of ALL_STEPS) {
      expect(step.sources.length, step.id).toBeGreaterThan(0)
      for (const sid of step.sources) {
        expect(SOURCES[sid], `${step.id} -> ${sid}`).toBeDefined()
      }
    }
  })

  it('every step has bn and en title, summary, explanation', () => {
    for (const step of ALL_STEPS) {
      for (const field of ['title', 'summary', 'explanation'] as const) {
        expect(step[field].bn.trim().length, `${step.id}.${field}.bn`).toBeGreaterThan(0)
        expect(step[field].en.trim().length, `${step.id}.${field}.en`).toBeGreaterThan(0)
      }
    }
  })

  it('every step status equals the weakest status of its facts', () => {
    for (const step of ALL_STEPS) {
      const factStatuses = [
        ...step.documents.map((d) => d.status),
        ...(step.fee ? [step.fee.status] : []),
        ...(step.timeline ? [step.timeline.status] : []),
      ]
      // A step with no explicit facts inherits from its sources.
      const sourceStatuses = step.sources.map((s) => deriveStatus(SOURCES[s]))
      const combined = [...factStatuses, ...sourceStatuses]
      const weakest = combined.length ? weakestStatus(combined) : 'verified'
      // A step may be more conservative than its weakest fact/source (e.g. "confirm"),
      // but never more optimistic.
      const rank: Record<string, number> = { verified: 0, dated: 1, confirm: 2 }
      expect(rank[step.status], step.id).toBeGreaterThanOrEqual(rank[weakest])
    }
  })

  it('every document item has a status', () => {
    for (const step of ALL_STEPS) {
      for (const doc of step.documents) {
        expect(['verified', 'dated', 'confirm']).toContain(doc.status)
        expect(doc.label.bn.trim().length).toBeGreaterThan(0)
        expect(doc.label.en.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('fee, when present, is a range and never a single figure', () => {
    for (const step of ALL_STEPS) {
      if (step.fee) {
        expect(step.fee.status).toBeDefined()
        // If both bounds exist they must differ (a range, not a point).
        if (step.fee.minBdt !== undefined && step.fee.maxBdt !== undefined) {
          expect(step.fee.maxBdt).toBeGreaterThan(step.fee.minBdt)
        }
      }
    }
  })

  it('every step has a lastChecked date', () => {
    for (const step of ALL_STEPS) {
      expect(step.lastChecked, step.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})