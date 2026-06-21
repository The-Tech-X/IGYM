'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CafeMenuItem } from '@/lib/supabase/types'

export async function getCafeItems(): Promise<CafeMenuItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cafe_menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getCafeItem(id: string): Promise<CafeMenuItem | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cafe_menu_items')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

export async function createCafeItem(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const num = (v: FormDataEntryValue | null) => {
    const s = v as string
    return s && s.trim() !== '' ? parseFloat(s) : null
  }

  const cal = formData.get('calories') as string

  const { error } = await supabase.from('cafe_menu_items').insert({
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    description: (formData.get('description') as string) || null,
    price: parseFloat(formData.get('price') as string) || 0,
    image_url: (formData.get('image_url') as string) || null,
    protein_g: num(formData.get('protein_g')),
    carbs_g: num(formData.get('carbs_g')),
    fat_g: num(formData.get('fat_g')),
    calories: cal && cal.trim() !== '' ? parseInt(cal, 10) : null,
    is_available: formData.get('is_available') === 'true',
    display_order: parseInt(formData.get('display_order') as string, 10) || 0,
  })

  if (error) return { error: error.message }

  revalidatePath('/cafe')
  revalidatePath('/admin/cafe')
  redirect('/admin/cafe')
}

export async function updateCafeItem(
  id: string,
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const num = (v: FormDataEntryValue | null) => {
    const s = v as string
    return s && s.trim() !== '' ? parseFloat(s) : null
  }

  const cal = formData.get('calories') as string

  const { error } = await supabase
    .from('cafe_menu_items')
    .update({
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: (formData.get('description') as string) || null,
      price: parseFloat(formData.get('price') as string) || 0,
      image_url: (formData.get('image_url') as string) || null,
      protein_g: num(formData.get('protein_g')),
      carbs_g: num(formData.get('carbs_g')),
      fat_g: num(formData.get('fat_g')),
      calories: cal && cal.trim() !== '' ? parseInt(cal, 10) : null,
      is_available: formData.get('is_available') === 'true',
      display_order: parseInt(formData.get('display_order') as string, 10) || 0,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/cafe')
  revalidatePath('/admin/cafe')
  redirect('/admin/cafe')
}

export async function deleteCafeItem(
  id: string
): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const { error } = await supabase.from('cafe_menu_items').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/cafe')
  revalidatePath('/admin/cafe')
}
