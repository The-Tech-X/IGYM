import { describe, it, expect } from 'vitest'
import { slugify } from '../slugify'

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('removes special characters', () => {
    expect(slugify('The Science! Of Hypertrophy@')).toBe('the-science-of-hypertrophy')
  })
  it('trims leading and trailing spaces', () => {
    expect(slugify('  spaces  ')).toBe('spaces')
  })
  it('collapses multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })
  it('handles numbers', () => {
    expect(slugify('Top 10 Exercises')).toBe('top-10-exercises')
  })
})
