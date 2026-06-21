'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { Role } from '@/lib/supabase/types'

async function requireAdmin(): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const admin = createAdminClient()
  const { data: me } = await admin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!me || me.role !== 'admin') return { error: 'Unauthorised' }
  return { id: user.id }
}

export async function getAdminUsers(): Promise<
  Array<{
    id: string
    email: string
    display_name: string
    role: Role
    created_at: string
  }>
> {
  const guard = await requireAdmin()
  if ('error' in guard) return []

  const admin = createAdminClient()

  const { data: rows } = await admin
    .from('admin_users')
    .select('id, display_name, role, created_at')

  if (!rows) return []

  const {
    data: { users },
  } = await admin.auth.admin.listUsers()

  const emailById = new Map<string, string>()
  for (const u of users) {
    emailById.set(u.id, u.email ?? '')
  }

  return rows.map((row) => ({
    id: row.id as string,
    email: emailById.get(row.id as string) ?? '',
    display_name: row.display_name as string,
    role: row.role as Role,
    created_at: row.created_at as string,
  }))
}

export async function inviteUser(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }

  const email = formData.get('email') as string
  const display_name = formData.get('display_name') as string
  const rawRole = formData.get('role') as string
  const role: Role = rawRole === 'admin' || rawRole === 'editor' ? rawRole : 'editor'

  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email)
  if (error) return { error: error.message }

  const { error: insertError } = await admin
    .from('admin_users')
    .insert({ id: data.user.id, display_name, role })
  if (insertError) return { error: insertError.message }

  revalidatePath('/admin/settings')
  return { success: `Invite sent to ${email}` }
}

export async function changeUserRole(
  userId: string,
  role: Role
): Promise<{ error?: string }> {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }

  // Block self-role-change. This also guarantees the system can never reach
  // zero admins: the last admin can only be demoted by themselves (blocked),
  // since any other demoter would mean another admin still exists.
  if (userId === guard.id)
    return { error: 'You cannot change your own role' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_users')
    .update({ role })
    .eq('id', userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return {}
}

export async function removeUser(userId: string): Promise<{ error?: string }> {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }

  if (userId === guard.id) return { error: 'You cannot remove yourself' }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return {}
}
