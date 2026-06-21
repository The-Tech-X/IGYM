interface TipTapNode {
  type: string
  text?: string
  content?: TipTapNode[]
}

function extractText(node: TipTapNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (node.content) return node.content.map(extractText).join(' ')
  return ''
}

export function calculateReadTime(body: Record<string, unknown>): number {
  const text = extractText(body as unknown as TipTapNode)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}
