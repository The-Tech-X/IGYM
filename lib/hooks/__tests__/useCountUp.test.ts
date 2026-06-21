import { describe, it, expect } from 'vitest'
import { formatCount } from '../useCountUp'

describe('formatCount', () => {
  it('formats integers with thousands separators', () => {
    expect(formatCount(2400, 0)).toBe('2,400')
  })
  it('formats one-decimal ratings', () => {
    expect(formatCount(4.9, 1)).toBe('4.9')
  })
  it('rounds down to integer when decimals is 0', () => {
    expect(formatCount(13.4, 0)).toBe('13')
  })
  it('rounds decimals to the requested precision', () => {
    expect(formatCount(4.86, 1)).toBe('4.9')
  })
  it('formats zero', () => {
    expect(formatCount(0, 0)).toBe('0')
  })
  it('formats millions with thousands separators', () => {
    expect(formatCount(1000000, 0)).toBe('1,000,000')
  })
})
