import OpenAI from 'openai'
import { buildContext } from '@/lib/chat/context'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { createAdminClient } from '@/lib/supabase/admin'

const LEAD_MARKER_START = '<<LEAD:'
const LEAD_MARKER_END = '>>'

function parseLeadMarker(marker: string): { name: string; phone: string; enquiry: string } | null {
  const inner = marker.slice(LEAD_MARKER_START.length, marker.length - LEAD_MARKER_END.length)

  const enquiryIdx = inner.indexOf(',enquiry=')
  const mainPart = enquiryIdx !== -1 ? inner.slice(0, enquiryIdx) : inner
  const enquiryValue = enquiryIdx !== -1 ? inner.slice(enquiryIdx + ',enquiry='.length) : ''

  const parts: Record<string, string> = {}
  for (const segment of mainPart.split(',')) {
    const eqIdx = segment.indexOf('=')
    if (eqIdx === -1) continue
    parts[segment.slice(0, eqIdx).trim()] = segment.slice(eqIdx + 1).trim()
  }

  if (!parts.name || !parts.phone) return null
  return { name: parts.name, phone: parts.phone, enquiry: enquiryValue }
}

async function saveLead(lead: { name: string; phone: string; enquiry: string }) {
  try {
    const db = createAdminClient()
    await db.from('leads').insert({
      name: lead.name,
      phone: lead.phone,
      enquiry: lead.enquiry || null,
    })
  } catch (err) {
    console.error('[chat] Failed to save lead:', err)
  }
}

export async function POST(req: Request) {
  if (!process.env.NVIDIA_API_KEY) {
    return Response.json({ error: 'Chat not configured' }, { status: 500 })
  }

  let messages: Array<{ role: 'user' | 'assistant'; content: string }>
  try {
    const body = await req.json()
    if (!Array.isArray(body.messages)) throw new Error('messages must be an array')
    const validRoles = new Set(['user', 'assistant'])
    messages = (body.messages as unknown[])
      .filter(
        (m): m is { role: 'user' | 'assistant'; content: string } =>
          typeof m === 'object' &&
          m !== null &&
          validRoles.has((m as { role: unknown }).role as string) &&
          typeof (m as { content: unknown }).content === 'string' &&
          (m as { content: string }).content.length <= 2000
      )
      .slice(-20) // cap to last 20 messages to prevent cost amplification
    if (messages.length === 0) throw new Error('no valid messages')
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const context = await buildContext()
  const systemPrompt = buildSystemPrompt(context)

  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  })

  const stream = await client.chat.completions.create({
    model: 'mistralai/mistral-medium-3.5-128b',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 1024,
    temperature: 0.7,
    stream: true,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      // Tail buffer to detect <<LEAD:...>> markers that may span chunk boundaries
      let tailBuffer = ''
      let leadSaved = false

      function flush(text: string) {
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
      }

      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content
          if (!delta) continue

          tailBuffer += delta

          // Check if marker start is present in buffer
          const markerStartIdx = tailBuffer.indexOf(LEAD_MARKER_START)

          if (markerStartIdx === -1) {
            // No marker started — safe to flush all but last few chars (in case marker spans next chunk)
            const safeLen = Math.max(0, tailBuffer.length - LEAD_MARKER_START.length)
            if (safeLen > 0) {
              flush(tailBuffer.slice(0, safeLen))
              tailBuffer = tailBuffer.slice(safeLen)
            }
          } else {
            // Marker started — flush text before the marker
            if (markerStartIdx > 0) {
              flush(tailBuffer.slice(0, markerStartIdx))
              tailBuffer = tailBuffer.slice(markerStartIdx)
            }
            // Check if marker end is present
            const markerEndIdx = tailBuffer.lastIndexOf(LEAD_MARKER_END)
            if (markerEndIdx !== -1) {
              // Full marker found — parse, save, discard
              const fullMarker = tailBuffer.slice(0, markerEndIdx + LEAD_MARKER_END.length)
              tailBuffer = tailBuffer.slice(markerEndIdx + LEAD_MARKER_END.length)
              if (!leadSaved) {
                leadSaved = true
                const lead = parseLeadMarker(fullMarker)
                if (lead) saveLead(lead) // fire-and-forget
              }
              // Flush any text after the marker in the current buffer
              if (tailBuffer) {
                flush(tailBuffer)
                tailBuffer = ''
              }
            }
            // else: marker is incomplete — keep buffering
          }
        }

        // Stream done — flush any remaining buffer (without the marker if still incomplete)
        if (tailBuffer) {
          const markerStartIdx = tailBuffer.indexOf(LEAD_MARKER_START)
          if (markerStartIdx === -1) {
            flush(tailBuffer)
          } else {
            // Incomplete marker at end of stream — flush text before it, discard the partial marker
            if (markerStartIdx > 0) flush(tailBuffer.slice(0, markerStartIdx))
          }
        }
      } catch (err) {
        console.error('[chat] Stream error:', err)
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
