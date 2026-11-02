import { describe, it, expect } from 'vitest'
import { buildRoadmap, needsTradeLicense, needsDbid } from './build-roadmap'
import type { Intake } from '../rules/types'

function intake(overrides: Partial<Intake> = {}): Intake {
  return {
    sells: 'retail',
    area: 'dhaka-north',
    channels: ['shop'],
    premises: 'rented',
    food: false,
    ...overrides,
  }
}

describe('buildRoadmap', () => {
  it('shop only -> trade license path, no dbid', () => {
    const r = buildRoadmap(intake({ channels: ['shop'] }))
    expect(needsTradeLicense(intake({ channels: ['shop'] }))).toBe(true)
    expect(needsDbid(intake({ channels: ['shop'] }))).toBe(false)
    expect(r.steps.every((s) => s.path === 'trade-license')).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('online only -> dbid path, no trade license', () => {
    const i = intake({ channels: ['online'], premises: 'family', food: false })
    const r = buildRoadmap(i)
    expect(needsTradeLicense(i)).toBe(false)
    expect(needsDbid(i)).toBe(true)
    expect(r.steps.every((s) => s.path === 'dbid')).toBe(true)
  })

  it('both -> both paths, with confirm note', () => {
    const i = intake({ channels: ['shop', 'online'], premises: 'family' })
    const r = buildRoadmap(i)
    const paths = new Set(r.steps.map((s) => s.path))
    expect(paths.has('trade-license')).toBe(true)
    expect(paths.has('dbid')).toBe(true)
    expect(r.notes).toContain('confirm-trade-license')
  })

  it('online food -> dbid path and food aggregator step present', () => {
    const i = intake({ channels: ['online'], premises: 'family', food: true, sells: 'food' })
    const r = buildRoadmap(i)
    expect(r.steps.some((s) => s.id === 'dbid-apply')).toBe(true)
    expect(r.steps.every((s) => s.path === 'dbid')).toBe(true)
  })

  it('rented premises -> trade license doc step includes rent proof', () => {
    const i = intake({ channels: ['shop'], premises: 'rented' })
    const r = buildRoadmap(i)
    const docs = r.steps.find((s) => s.id === 'tl-documents')!
    expect(docs.documents.some((d) => /rent/i.test(d.label.en))).toBe(true)
  })

  it('owned premises -> trade license still applies', () => {
    const i = intake({ channels: ['shop'], premises: 'owned' })
    const r = buildRoadmap(i)
    expect(r.steps.some((s) => s.id === 'tl-documents')).toBe(true)
  })

  it('dhaka north -> trade license applies', () => {
    const i = intake({ channels: ['shop'], area: 'dhaka-north' })
    const r = buildRoadmap(i)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('dhaka south -> trade license applies', () => {
    const i = intake({ channels: ['shop'], area: 'dhaka-south' })
    const r = buildRoadmap(i)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('other area -> trade license applies with office step', () => {
    const i = intake({ channels: ['shop'], area: 'other' })
    const r = buildRoadmap(i)
    expect(r.steps.some((s) => s.id === 'tl-office')).toBe(true)
  })

  it('online + rented -> dbid premises docs step included', () => {
    const i = intake({ channels: ['online'], premises: 'rented' })
    const r = buildRoadmap(i)
    expect(r.steps.some((s) => s.id === 'dbid-docs')).toBe(true)
  })

  it('online + owned -> dbid premises docs step excluded', () => {
    const i = intake({ channels: ['online'], premises: 'owned' })
    const r = buildRoadmap(i)
    expect(r.steps.some((s) => s.id === 'dbid-docs')).toBe(false)
  })

  it('service only -> trade license path', () => {
    const i = intake({ channels: ['service'] })
    const r = buildRoadmap(i)
    expect(r.steps.every((s) => s.path === 'trade-license')).toBe(true)
  })
})