import { createAdminClient } from '@/lib/supabase/admin'

export async function buildContext(): Promise<string> {
  const db = createAdminClient()

  const [gymInfoRes, trainersRes, cafeRes] = await Promise.all([
    db.from('gym_info').select('content').single(),
    db.from('trainers').select('name, role, specialty_eyebrow').eq('is_active', true).order('display_order', { ascending: true }),
    db.from('cafe_menu_items').select('name, description, price, category').order('category', { ascending: true }),
  ])

  const gymContent = gymInfoRes.data?.content ?? ''
  const trainers = trainersRes.data ?? []
  const cafeItems = cafeRes.data ?? []

  // Group cafe items by category
  const cafeByCategory = cafeItems.reduce((acc: Record<string, typeof cafeItems>, item) => {
    const cat = item.category ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const cafeSection = Object.entries(cafeByCategory)
    .map(([cat, items]) => {
      const itemLines = items.map(i => {
        const price = i.price != null ? ` — ₹${i.price}` : ''
        const desc = i.description ? ` (${i.description})` : ''
        return `  ${i.name}${desc}${price}`
      }).join('\n')
      return `${cat}:\n${itemLines}`
    })
    .join('\n\n')

  const trainerSection = trainers
    .map(t => `  ${t.name} — ${t.role} (${t.specialty_eyebrow})`)
    .join('\n')

  return [
    gymContent ? `=== GYM INFORMATION ===\n${gymContent}` : '',
    trainers.length ? `=== TRAINERS ===\n${trainerSection}` : '',
    cafeItems.length ? `=== CAFÉ MENU ===\n${cafeSection}` : '',
  ].filter(Boolean).join('\n\n')
}
