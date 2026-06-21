'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Trainer } from '@/lib/supabase/types'

export async function getTrainers(): Promise<Trainer[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trainers')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getTrainer(id: string): Promise<Trainer | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trainers')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

export async function createTrainer(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const imageUrl = formData.get('image_url') as string

  const { error } = await supabase.from('trainers').insert({
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    role: formData.get('role') as string,
    specialty_eyebrow: formData.get('specialty_eyebrow') as string,
    instagram: (formData.get('instagram') as string) || null,
    display_order: parseInt(formData.get('display_order') as string, 10) || 0,
    specialties: JSON.parse(formData.get('specialties') as string) as string[],
    certifications: JSON.parse(
      formData.get('certifications') as string
    ) as string[],
    bio: JSON.parse(formData.get('bio') as string) as string[],
    availability: JSON.parse(formData.get('availability') as string) as Array<{
      day: string
      hours: string
    }>,
    image_url: imageUrl || null,
    is_active: formData.get('is_active') === 'true',
  })

  if (error) return { error: error.message }

  revalidatePath('/trainers')
  revalidatePath('/admin/trainers')
  redirect('/admin/trainers')
}

export async function updateTrainer(
  id: string,
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const imageUrl = formData.get('image_url') as string
  const slug = formData.get('slug') as string

  const { error } = await supabase
    .from('trainers')
    .update({
      name: formData.get('name') as string,
      slug,
      role: formData.get('role') as string,
      specialty_eyebrow: formData.get('specialty_eyebrow') as string,
      instagram: (formData.get('instagram') as string) || null,
      display_order: parseInt(formData.get('display_order') as string, 10) || 0,
      specialties: JSON.parse(
        formData.get('specialties') as string
      ) as string[],
      certifications: JSON.parse(
        formData.get('certifications') as string
      ) as string[],
      bio: JSON.parse(formData.get('bio') as string) as string[],
      availability: JSON.parse(
        formData.get('availability') as string
      ) as Array<{ day: string; hours: string }>,
      image_url: imageUrl || null,
      is_active: formData.get('is_active') === 'true',
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/trainers')
  revalidatePath('/admin/trainers')
  revalidatePath(`/trainers/${slug}`)
  redirect('/admin/trainers')
}

export async function deleteTrainer(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const { error } = await supabase.from('trainers').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/trainers')
  revalidatePath('/admin/trainers')
}
