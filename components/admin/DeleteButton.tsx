'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  action: () => Promise<void | { error?: string }>
  confirmMessage: string
}

export default function DeleteButton({
  action,
  confirmMessage,
}: DeleteButtonProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function onClick() {
    if (!window.confirm(confirmMessage)) return
    startTransition(async () => {
      const result = await action()
      if (result && 'error' in result && result.error) {
        window.alert(`Delete failed: ${result.error}`)
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      title="Delete"
      className="text-zinc-400 hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  )
}
