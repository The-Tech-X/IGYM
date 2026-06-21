import Link from 'next/link'
import { getCafeItems, deleteCafeItem } from '@/app/admin/actions/cafe'
import DeleteButton from '@/components/admin/DeleteButton'
import type { CafeMenuItem } from '@/lib/supabase/types'

const CATEGORIES = [
  'Pre-Workout',
  'Post-Workout',
  'Meals',
  'Juices',
  'Shakes',
] as const

export default async function CafePage() {
  const items: CafeMenuItem[] = await getCafeItems()

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-2xl font-light text-zinc-800"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Café Menu
          </h1>
          <p className="text-sm text-zinc-500">
            {items.length} item{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/cafe/new"
          className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors"
        >
          New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-lg p-12 text-center text-zinc-500">
          <p>No menu items yet.</p>
          <p>Add your first item to get started.</p>
        </div>
      ) : (
        CATEGORIES.map((category) => {
          const group = items.filter((item) => item.category === category)
          if (group.length === 0) return null

          return (
            <div key={category}>
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 mt-8">
                {category}
              </h2>
              <div className="space-y-3">
                {group.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-4"
                  >
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-zinc-200" />
                    )}

                    <div className="flex-1">
                      <p className="text-zinc-800 font-medium">{item.name}</p>
                      <p className="text-sm text-zinc-500">
                        ₹{item.price}
                        {item.calories != null && ` · ${item.calories} kcal`}
                      </p>
                    </div>

                    {item.is_available ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}

                    <Link
                      href={`/admin/cafe/${item.id}/edit`}
                      className="text-sm text-[#C9A84C] hover:underline"
                    >
                      Edit
                    </Link>

                    <DeleteButton
                      action={async () => {
                        'use server'
                        return await deleteCafeItem(item.id)
                      }}
                      confirmMessage={`Delete ${item.name}?`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
