import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import {
  getAdminUsers,
  changeUserRole,
  removeUser,
} from '@/app/admin/actions/users'
import InviteUserForm from '@/components/admin/InviteUserForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/dashboard')

  const adminDb = createAdminClient()
  const { data: me } = await adminDb
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!me || me.role !== 'admin') redirect('/admin/dashboard')

  const currentUserId = user.id
  const users = await getAdminUsers()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-light text-zinc-800 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Settings — User Management
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Invite teammates and manage their access roles
        </p>
      </div>

      {/* Users table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs text-zinc-400 uppercase tracking-widest">
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Display Name</th>
              <th className="px-5 py-3 font-normal">Role</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-5 py-3 text-zinc-700">{u.email}</td>
                <td className="px-5 py-3 text-zinc-700">{u.display_name}</td>
                <td className="px-5 py-3">
                  {u.role === 'admin' ? (
                    <span className="bg-[#C9A84C]/15 text-[#C9A84C] text-xs px-2.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  ) : (
                    <span className="bg-zinc-100 text-zinc-600 text-xs px-2.5 py-0.5 rounded-full">
                      Editor
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {u.id !== currentUserId && (
                      <form
                        action={async () => {
                          'use server'
                          await changeUserRole(
                            u.id,
                            u.role === 'admin' ? 'editor' : 'admin'
                          )
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors"
                        >
                          {u.role === 'admin' ? 'Make Editor' : 'Make Admin'}
                        </button>
                      </form>
                    )}

                    {u.id !== currentUserId && (
                      <form
                        action={async () => {
                          'use server'
                          await removeUser(u.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite form */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 max-w-md">
        <h2 className="text-sm font-medium text-zinc-800 mb-1">
          Invite a new user
        </h2>
        <p className="text-xs text-zinc-500 mb-5">
          They will receive an email invitation to set their password.
        </p>
        <InviteUserForm />
      </div>
    </div>
  )
}
