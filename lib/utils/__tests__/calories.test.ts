import { describe, it, expect } from 'vitest'
import { suggestCalories } from '../calories'

describe('suggestCalories', () => {
  it('calculates protein*4 + carbs*4 + fat*9', () => {
    expect(suggestCalories(25, 30, 10)).toBe(310)
  })
  it('returns 0 for all zeros', () => {
    expect(suggestCalories(0, 0, 0)).toBe(0)
  })
  it('rounds to nearest integer', () => {
    expect(suggestCalories(1, 1, 1)).toBe(17)
  })
  it('handles decimals', () => {
    expect(suggestCalories(0, 0, 1.5)).toBe(14)
  })
})
