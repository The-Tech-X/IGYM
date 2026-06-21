// Server-safe TipTap JSON → HTML renderer.
//
// @tiptap/html's generateHTML only runs in a browser, and the /server variant
// needs happy-dom. This project's editor (StarterKit + Image) emits a small,
// known node/mark set, so we render it directly with no DOM dependency.
//
// All text and attribute values are HTML-escaped to prevent injection.

interface TipTapMark {
  type: string
  attrs?: Record<string, unknown>
}

interface TipTapNode {
  type?: string
  text?: string
  marks?: TipTapMark[]
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function renderMarks(text: string, marks: TipTapMark[] | undefined): string {
  if (!marks || marks.length === 0) return text
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case 'bold':
        return `<strong>${acc}</strong>`
      case 'italic':
        return `<em>${acc}</em>`
      case 'strike':
        return `<s>${acc}</s>`
      case 'code':
        return `<code>${acc}</code>`
      case 'link': {
        // Allowlist safe URL schemes — block javascript:/data:/etc.
        const raw = String(mark.attrs?.href ?? '#')
        const safe = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(raw) ? raw : '#'
        const href = escapeAttr(safe)
        return `<a href="${href}" rel="noopener noreferrer" target="_blank">${acc}</a>`
      }
      default:
        return acc
    }
  }, text)
}

function renderChildren(nodes: TipTapNode[] | undefined): string {
  if (!nodes) return ''
  return nodes.map(renderNode).join('')
}

function renderNode(node: TipTapNode): string {
  switch (node.type) {
    case 'text':
      return renderMarks(escapeText(node.text ?? ''), node.marks)
    case 'paragraph':
      return `<p>${renderChildren(node.content)}</p>`
    case 'heading': {
      const level = Number(node.attrs?.level) || 2
      const safeLevel = level >= 1 && level <= 6 ? level : 2
      return `<h${safeLevel}>${renderChildren(node.content)}</h${safeLevel}>`
    }
    case 'blockquote':
      return `<blockquote>${renderChildren(node.content)}</blockquote>`
    case 'bulletList':
      return `<ul>${renderChildren(node.content)}</ul>`
    case 'orderedList':
      return `<ol>${renderChildren(node.content)}</ol>`
    case 'listItem':
      return `<li>${renderChildren(node.content)}</li>`
    case 'codeBlock':
      return `<pre><code>${renderChildren(node.content)}</code></pre>`
    case 'horizontalRule':
      return '<hr>'
    case 'hardBreak':
      return '<br>'
    case 'image': {
      const src = escapeAttr(String(node.attrs?.src ?? ''))
      const alt = escapeAttr(String(node.attrs?.alt ?? ''))
      if (!src) return ''
      return `<img src="${src}" alt="${alt}">`
    }
    case 'doc':
      return renderChildren(node.content)
    default:
      // Unknown node — render its children if any, otherwise drop it.
      return renderChildren(node.content)
  }
}

export function tiptapToHtml(doc: Record<string, unknown> | null | undefined): string {
  if (!doc || typeof doc !== 'object') return ''
  return renderNode(doc as TipTapNode)
}
