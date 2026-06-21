'use client'

import { useActionState } from 'react'
import { inviteUser } from '@/app/admin/actions/users'

export default function InviteUserForm() {
  const [state, action, pending] = useActionState(inviteUser, undefined)

  const inputClass =
    'w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]'

  return (
    <form action={action} className="space-y-4">
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && (
        <p className="text-green-600 text-sm">{state.success}</p>
      )}

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="email@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Display name</label>
        <input
          name="display_name"
          type="text"
          required
          placeholder="Display name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Role</label>
        <select name="role" defaultValue="editor" className={inputClass}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 rounded text-sm hover:bg-[#b8933d] disabled:opacity-60 transition-colors"
      >
        {pending ? 'Sending…' : 'Send Invite'}
      </button>
    </form>
  )
}
