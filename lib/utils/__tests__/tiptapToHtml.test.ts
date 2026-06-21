import { describe, it, expect } from 'vitest'
import { tiptapToHtml } from '../tiptapToHtml'

describe('tiptapToHtml', () => {
  it('renders a paragraph with text', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<p>Hello world</p>')
  })

  it('renders headings at the given level', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Title' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Sub' }] },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<h2>Title</h2><h3>Sub</h3>')
  })

  it('applies bold and italic marks', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'a', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'b', marks: [{ type: 'italic' }] },
          ],
        },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<p><strong>a</strong><em>b</em></p>')
  })

  it('renders bullet and ordered lists', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'one' }] }] },
          ],
        },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<ul><li><p>one</p></li></ul>')
  })

  it('renders blockquote, hr, and image', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'q' }] }] },
        { type: 'horizontalRule' },
        { type: 'image', attrs: { src: 'https://x.com/a.jpg', alt: 'pic' } },
      ],
    }
    expect(tiptapToHtml(doc)).toBe(
      '<blockquote><p>q</p></blockquote><hr><img src="https://x.com/a.jpg" alt="pic">'
    )
  })

  it('escapes HTML in text to prevent injection', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '<script>alert(1)</script>' }] },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')
  })

  it('escapes image attributes', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'image', attrs: { src: 'x" onerror="alert(1)', alt: '' } },
      ],
    }
    expect(tiptapToHtml(doc)).toBe('<img src="x&quot; onerror=&quot;alert(1)" alt="">')
  })

  it('allows safe link schemes', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'go', marks: [{ type: 'link', attrs: { href: 'https://igym.in' } }] },
          ],
        },
      ],
    }
    expect(tiptapToHtml(doc)).toBe(
      '<p><a href="https://igym.in" rel="noopener noreferrer" target="_blank">go</a></p>'
    )
  })

  it('blocks javascript: URIs in link hrefs', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'click', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] },
          ],
        },
      ],
    }
    expect(tiptapToHtml(doc)).toBe(
      '<p><a href="#" rel="noopener noreferrer" target="_blank">click</a></p>'
    )
  })

  it('returns empty string for null/empty input', () => {
    expect(tiptapToHtml(null)).toBe('')
    expect(tiptapToHtml(undefined)).toBe('')
    expect(tiptapToHtml({})).toBe('')
  })
})
