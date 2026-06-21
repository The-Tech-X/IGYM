import Link from 'next/link'

import CafeItemForm from '@/components/admin/CafeItemForm'
import { createCafeItem } from '@/app/admin/actions/cafe'

export default function NewCafeItemPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/admin/cafe"
        className="text-sm text-zinc-500 hover:text-zinc-700 mb-6 inline-block"
      >
        ← Back to Café
      </Link>
      <h1
        className="text-2xl font-light text-zinc-800 mb-6"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        New Menu Item
      </h1>
      <CafeItemForm action={createCafeItem} />
    </div>
  )
}
