import { describe, it, expect } from 'vitest'
import { calculateReadTime } from '../readTime'

function makeBody(wordCount: number) {
  return {
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: [{ type: 'text', text: Array(wordCount).fill('word').join(' ') }],
    }],
  }
}

describe('calculateReadTime', () => {
  it('returns 1 for content under 200 words', () => {
    expect(calculateReadTime(makeBody(50))).toBe(1)
  })
  it('returns 1 for exactly 200 words', () => {
    expect(calculateReadTime(makeBody(200))).toBe(1)
  })
  it('returns 2 for 201 words', () => {
    expect(calculateReadTime(makeBody(201))).toBe(2)
  })
  it('returns 1 minimum for empty body', () => {
    expect(calculateReadTime({ type: 'doc', content: [] })).toBe(1)
  })
  it('extracts text from nested nodes', () => {
    const body = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: Array(100).fill('word').join(' ') }] },
        { type: 'paragraph', content: [{ type: 'text', text: Array(101).fill('word').join(' ') }] },
      ],
    }
    expect(calculateReadTime(body)).toBe(2)
  })
})
