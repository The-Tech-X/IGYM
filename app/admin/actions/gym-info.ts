'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { GymInfo } from '@/lib/supabase/types'

export async function getGymInfo(): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gym_info')
    .select('content')
    .single()
  return data?.content ?? ''
}

export async function updateGymInfo(
  formData: FormData
): Promise<void> {
  const supabase = await createClient()
  const content = formData.get('content') as string

  const { error } = await supabase
    .from('gym_info')
    .update({ content })
    .eq('id', true)

  if (error) {
    console.error('[gym-info] Failed to update:', error.message)
    return
  }

  revalidatePath('/admin/knowledge')
}
