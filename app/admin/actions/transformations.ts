'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Transformation } from '@/lib/supabase/types'

export async function getTransformations(
  trainerId: string
): Promise<Transformation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('transformations')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function createTransformation(
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()

  const testimonial = formData.get('testimonial') as string
  const beforeImageUrl = formData.get('before_image_url') as string
  const afterImageUrl = formData.get('after_image_url') as string

  const { error } = await supabase.from('transformations').insert({
    trainer_id: formData.get('trainer_id') as string,
    client_name: formData.get('client_name') as string,
    duration: formData.get('duration') as string,
    goal: formData.get('goal') as string,
    goal_type: formData.get('goal_type') as string,
    testimonial: testimonial || null,
    before_image_url: beforeImageUrl || null,
    after_image_url: afterImageUrl || null,
    display_order: parseInt(formData.get('display_order') as string, 10) || 0,
  })

  if (error) return { error: error.message }

  revalidatePath('/transformations')
  revalidatePath('/admin/trainers')
  return { success: true }
}

export async function updateTransformation(
  id: string,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()

  const testimonial = formData.get('testimonial') as string
  const beforeImageUrl = formData.get('before_image_url') as string
  const afterImageUrl = formData.get('after_image_url') as string

  const { error } = await supabase
    .from('transformations')
    .update({
      trainer_id: formData.get('trainer_id') as string,
      client_name: formData.get('client_name') as string,
      duration: formData.get('duration') as string,
      goal: formData.get('goal') as string,
      goal_type: formData.get('goal_type') as string,
      testimonial: testimonial || null,
      before_image_url: beforeImageUrl || null,
      after_image_url: afterImageUrl || null,
      display_order: parseInt(formData.get('display_order') as string, 10) || 0,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/transformations')
  revalidatePath('/admin/trainers')
  return { success: true }
}

export async function deleteTransformation(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('transformations')
    .delete()
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/transformations')
  revalidatePath('/admin/trainers')
}
