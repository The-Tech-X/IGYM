'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { JournalPost } from '@/lib/supabase/types'

export async function getJournalPosts(): Promise<Partial<JournalPost>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('journal_posts')
    .select('id, title, slug, category, is_published, published_at, updated_at')
    .order('updated_at', { ascending: false })
  return data ?? []
}

export async function getJournalPost(id: string): Promise<JournalPost | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

export async function createJournalPost(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const isPublished = formData.get('is_published') === 'true'

  const { error } = await supabase.from('journal_posts').insert({
    title: formData.get('title') as string,
    slug,
    category: formData.get('category') as string,
    excerpt: (formData.get('excerpt') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    author_name: formData.get('author_name') as string,
    author_avatar_url: (formData.get('author_avatar_url') as string) || null,
    body: JSON.parse(formData.get('body') as string),
    read_time_minutes:
      parseInt(formData.get('read_time_minutes') as string, 10) || 1,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    meta_title: (formData.get('meta_title') as string) || null,
    meta_description: (formData.get('meta_description') as string) || null,
    og_image_url: (formData.get('og_image_url') as string) || null,
    canonical_url: (formData.get('canonical_url') as string) || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
  if (isPublished) revalidatePath(`/journal/${slug}`)
  redirect('/admin/journal')
}

export async function updateJournalPost(
  id: string,
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const isPublished = formData.get('is_published') === 'true'

  const updates: Record<string, unknown> = {
    title: formData.get('title') as string,
    slug,
    category: formData.get('category') as string,
    excerpt: (formData.get('excerpt') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    author_name: formData.get('author_name') as string,
    author_avatar_url: (formData.get('author_avatar_url') as string) || null,
    body: JSON.parse(formData.get('body') as string),
    read_time_minutes:
      parseInt(formData.get('read_time_minutes') as string, 10) || 1,
    is_published: isPublished,
    meta_title: (formData.get('meta_title') as string) || null,
    meta_description: (formData.get('meta_description') as string) || null,
    og_image_url: (formData.get('og_image_url') as string) || null,
    canonical_url: (formData.get('canonical_url') as string) || null,
  }

  if (isPublished) {
    // Preserve the original publish date; only stamp now on first publish.
    // Fetch from the DB rather than trusting the form.
    const { data: existing } = await supabase
      .from('journal_posts')
      .select('published_at')
      .eq('id', id)
      .single()
    updates.published_at = existing?.published_at ?? new Date().toISOString()
  }

  const { error } = await supabase
    .from('journal_posts')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
  revalidatePath(`/journal/${slug}`)
  redirect('/admin/journal')
}

// Same as updateJournalPost but does NOT redirect — used by the editor's
// 30-second auto-save so the admin keeps editing uninterrupted.
export async function autosaveJournalPost(
  id: string,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const isPublished = formData.get('is_published') === 'true'

  const updates: Record<string, unknown> = {
    title: formData.get('title') as string,
    slug,
    category: formData.get('category') as string,
    excerpt: (formData.get('excerpt') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    author_name: formData.get('author_name') as string,
    author_avatar_url: (formData.get('author_avatar_url') as string) || null,
    body: JSON.parse(formData.get('body') as string),
    read_time_minutes:
      parseInt(formData.get('read_time_minutes') as string, 10) || 1,
    is_published: isPublished,
    meta_title: (formData.get('meta_title') as string) || null,
    meta_description: (formData.get('meta_description') as string) || null,
    og_image_url: (formData.get('og_image_url') as string) || null,
    canonical_url: (formData.get('canonical_url') as string) || null,
  }

  if (isPublished) {
    const { data: existing } = await supabase
      .from('journal_posts')
      .select('published_at')
      .eq('id', id)
      .single()
    updates.published_at = existing?.published_at ?? new Date().toISOString()
  }

  const { error } = await supabase
    .from('journal_posts')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
  revalidatePath(`/journal/${slug}`)
  return { success: true }
}

export async function publishPost(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('journal_posts')
    .select('published_at, slug')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('journal_posts')
    .update({
      is_published: true,
      published_at: existing?.published_at ?? new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
  if (existing?.slug) revalidatePath(`/journal/${existing.slug}`)
}

export async function unpublishPost(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('journal_posts')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('journal_posts')
    .update({ is_published: false })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
  if (existing?.slug) revalidatePath(`/journal/${existing.slug}`)
}

export async function deleteJournalPost(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const { error } = await supabase.from('journal_posts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/journal')
  revalidatePath('/admin/journal')
}
