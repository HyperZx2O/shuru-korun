import { describe, it, expect } from 'vitest'
import { retrieve } from './retrieve'

describe('retrieve', () => {
  it('returns relevant steps for a fee question', () => {
    const r = retrieve('trade license fee koto')
    expect(r.steps.some((s) => s.id === 'tl-fee')).toBe(true)
  })
  it('returns dbid steps for dbid question', () => {
    const r = retrieve('dbid kivabe apply korbo')
    expect(r.steps.some((s) => s.path === 'dbid')).toBe(true)
  })
  it('attaches sources from retrieved steps', () => {
    const r = retrieve('documents needed')
    expect(r.sourceIds.length).toBeGreaterThan(0)
  })
  it('returns the stepId step when no tokens match', () => {
    const r = retrieve('zzzz', 'tl-fee')
    expect(r.steps.some((s) => s.id === 'tl-fee')).toBe(true)
  })
})