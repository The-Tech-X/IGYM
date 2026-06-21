import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  // Use service-role client so RLS never blocks this lookup
  const adminDb = createAdminClient()
  const { data: adminUser, error } = await adminDb
    .from('admin_users')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (error || !adminUser) {
    console.error(
      '[admin layout] adminUser lookup failed.',
      'user.id =', user.id,
      '| error =', error?.message ?? '(no error, zero rows)'
    )
    redirect('/admin/sign-out')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50">
      <Sidebar
        role={adminUser.role as 'admin' | 'editor'}
        displayName={adminUser.display_name}
      />
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  )
}
