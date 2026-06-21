import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'

const BASE_URL = 'https://igym.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()

  const [postsRes, trainersRes] = await Promise.all([
    supabase.from('journal_posts').select('slug, updated_at').eq('is_published', true),
    supabase.from('trainers').select('slug, updated_at').eq('is_active', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/trainers`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/journal`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/cafe`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/membership`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/transformations`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const postRoutes: MetadataRoute.Sitemap = (postsRes.data ?? []).map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const trainerRoutes: MetadataRoute.Sitemap = (trainersRes.data ?? []).map((t) => ({
    url: `${BASE_URL}/trainers/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...trainerRoutes]
}
