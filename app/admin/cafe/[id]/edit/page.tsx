import Link from 'next/link'
import { notFound } from 'next/navigation'

import CafeItemForm from '@/components/admin/CafeItemForm'
import { getCafeItem, updateCafeItem } from '@/app/admin/actions/cafe'

export default async function EditCafeItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const item = await getCafeItem(id)

  if (!item) notFound()

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
        {item.name}
      </h1>
      <CafeItemForm item={item} action={updateCafeItem.bind(null, id)} />
    </div>
  )
}
