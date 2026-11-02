import { describe, it, expect } from 'vitest'
import { guard } from './guard'

describe('guard', () => {
  it('allows ordinary questions', () => {
    expect(guard('trade license kivabe pabo?').safe).toBe(true)
    expect(guard('What documents do I need?').safe).toBe(true)
  })
  it('blocks BD mobile numbers', () => {
    expect(guard('amar number 01712345678').safe).toBe(false)
  })
  it('blocks 13/17-digit NID-like numbers', () => {
    expect(guard('nid 1234567890').safe).toBe(true)
    expect(guard('nid 1234567890123').safe).toBe(false)
    expect(guard('nid 12345678901234567').safe).toBe(false)
  })
  it('blocks emails', () => {
    expect(guard('email me at a@b.com').safe).toBe(false)
  })
  it('blocks otp/pin mentions', () => {
    expect(guard('my otp is 1234').safe).toBe(false)
    expect(guard('share your pin').safe).toBe(false)
  })
})