import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProfileForms from '@/components/admin/ProfileForms'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/dashboard')

  const adminDb = createAdminClient()
  const { data: adminRow } = await adminDb
    .from('admin_users')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (!adminRow || adminRow.role !== 'admin') redirect('/admin/dashboard')

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/admin/settings"
        className="text-sm text-zinc-500 hover:text-[#C9A84C] transition-colors"
      >
        ← Back to Settings
      </Link>

      <div className="mt-4 mb-8">
        <h1
          className="text-2xl font-light text-zinc-800 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Profile
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account credentials
        </p>
      </div>

      <ProfileForms
        currentEmail={user.email ?? ''}
        currentDisplayName={adminRow.display_name ?? ''}
      />
    </div>
  )
}
