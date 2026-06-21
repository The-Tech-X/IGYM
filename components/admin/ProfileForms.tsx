'use client'

import { useActionState } from 'react'
import {
  updateDisplayName,
  updateEmail,
  updatePassword,
} from '@/app/admin/actions/profile'

interface ProfileFormsProps {
  currentEmail: string
  currentDisplayName: string
}

const inputClass =
  'w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]'
const buttonClass =
  'px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded hover:bg-[#b8933d] disabled:opacity-60 transition-colors'
const cardClass =
  'border border-zinc-200 rounded-lg p-6 bg-white space-y-3'
const headingClass = 'text-sm font-medium text-zinc-800'

function Feedback({
  state,
}: {
  state?: { error?: string; success?: string }
}) {
  if (state?.error)
    return <p className="text-red-500 text-sm">{state.error}</p>
  if (state?.success)
    return <p className="text-green-600 text-sm">{state.success}</p>
  return null
}

export default function ProfileForms({
  currentEmail,
  currentDisplayName,
}: ProfileFormsProps) {
  const [nameState, nameAction, namePending] = useActionState(
    updateDisplayName,
    undefined
  )
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmail,
    undefined
  )
  const [pwState, pwAction, pwPending] = useActionState(
    updatePassword,
    undefined
  )

  return (
    <div className="space-y-6">
      {/* Display Name */}
      <div className={cardClass}>
        <h2 className={headingClass}>Display Name</h2>
        <form action={nameAction} className="space-y-3">
          <input
            name="display_name"
            type="text"
            defaultValue={currentDisplayName}
            placeholder="Your name"
            className={inputClass}
          />
          <Feedback state={nameState} />
          <button type="submit" disabled={namePending} className={buttonClass}>
            {namePending ? 'Saving…' : 'Save Name'}
          </button>
        </form>
      </div>

      {/* Email */}
      <div className={cardClass}>
        <h2 className={headingClass}>Email</h2>
        <form action={emailAction} className="space-y-3">
          <p className="text-xs text-zinc-500">Current: {currentEmail}</p>
          <input
            name="email"
            type="email"
            placeholder="new@email.com"
            className={inputClass}
          />
          <Feedback state={emailState} />
          <button type="submit" disabled={emailPending} className={buttonClass}>
            {emailPending ? 'Updating…' : 'Update Email'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className={cardClass}>
        <h2 className={headingClass}>Password</h2>
        <form action={pwAction} className="space-y-3">
          <input
            name="password"
            type="password"
            placeholder="New password"
            className={inputClass}
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            className={inputClass}
          />
          <Feedback state={pwState} />
          <button type="submit" disabled={pwPending} className={buttonClass}>
            {pwPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
