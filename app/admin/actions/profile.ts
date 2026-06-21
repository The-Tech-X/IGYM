'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function currentAdminId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data } = await admin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!data || data.role !== 'admin') return null
  return user.id
}

export async function updateDisplayName(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const id = await currentAdminId()
  if (!id) return { error: 'Unauthorised' }

  const displayName = (formData.get('display_name') as string)?.trim()
  if (!displayName) return { error: 'Display name is required' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_users')
    .update({ display_name: displayName })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/settings/profile')
  revalidatePath('/admin', 'layout')
  return { success: 'Display name updated' }
}

export async function updateEmail(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const id = await currentAdminId()
  if (!id) return { error: 'Unauthorised' }

  const email = (formData.get('email') as string)?.trim()
  if (!email) return { error: 'Email is required' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ email })
  if (error) return { error: error.message }

  return { success: `Confirmation link sent to ${email}` }
}

export async function updatePassword(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const id = await currentAdminId()
  if (!id) return { error: 'Unauthorised' }

  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string

  if (!password || password.length < 8)
    return { error: 'Password must be at least 8 characters' }
  if (password !== confirm) return { error: 'Passwords do not match' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  return { success: 'Password updated' }
}
