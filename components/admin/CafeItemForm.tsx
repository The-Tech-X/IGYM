'use client'

import { useState } from 'react'
import Link from 'next/link'

import ImageUpload from '@/components/admin/ImageUpload'
import { suggestCalories } from '@/lib/utils/calories'
import type { CafeMenuItem } from '@/lib/supabase/types'

interface CafeItemFormProps {
  item?: CafeMenuItem
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

const CATEGORIES = [
  'Pre-Workout',
  'Post-Workout',
  'Meals',
  'Juices',
  'Shakes',
]

export default function CafeItemForm({ item, action }: CafeItemFormProps) {
  const isEditMode = !!item

  const [imageUrl, setImageUrl] = useState<string | null>(
    item?.image_url ?? null,
  )
  const [protein, setProtein] = useState<string>(
    item?.protein_g?.toString() ?? '',
  )
  const [carbs, setCarbs] = useState<string>(item?.carbs_g?.toString() ?? '')
  const [fat, setFat] = useState<string>(item?.fat_g?.toString() ?? '')
  const [calories, setCalories] = useState<string>(
    item?.calories?.toString() ?? '',
  )
  const [isAvailable, setIsAvailable] = useState<boolean>(
    item?.is_available ?? true,
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function recalc(p: string, c: string, f: string) {
    setCalories(
      suggestCalories(
        parseFloat(p) || 0,
        parseFloat(c) || 0,
        parseFloat(f) || 0,
      ).toString(),
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('image_url', imageUrl ?? '')
    fd.set('protein_g', protein)
    fd.set('carbs_g', carbs)
    fd.set('fat_g', fat)
    fd.set('calories', calories)
    fd.set('is_available', isAvailable ? 'true' : 'false')

    const result = await action(fd)
    if (result && result.error) {
      setError(result.error)
      setPending(false)
    }
  }

  const inputClass =
    'w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]'
  const labelClass = 'text-sm text-zinc-600 mb-1 block'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* Name */}
      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          name="name"
          defaultValue={item?.name}
          required
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          name="category"
          defaultValue={item?.category ?? 'Pre-Workout'}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          defaultValue={item?.description ?? ''}
          rows={3}
          className={inputClass}
        />
      </div>

      {/* Price */}
      <div>
        <label className={labelClass}>Price (₹)</label>
        <input
          type="number"
          name="price"
          step="0.01"
          defaultValue={item?.price ?? ''}
          required
          className={inputClass}
        />
      </div>

      {/* Display Order */}
      <div>
        <label className={labelClass}>Display Order</label>
        <input
          type="number"
          name="display_order"
          defaultValue={item?.display_order ?? 0}
          className={inputClass}
        />
      </div>

      {/* Image */}
      <div>
        <ImageUpload
          bucket="cafe-images"
          currentUrl={imageUrl}
          onUpload={setImageUrl}
          label="Image"
        />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Protein (g)</label>
          <input
            type="number"
            name="protein_g"
            value={protein}
            onChange={(e) => {
              setProtein(e.target.value)
              recalc(e.target.value, carbs, fat)
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Carbs (g)</label>
          <input
            type="number"
            name="carbs_g"
            value={carbs}
            onChange={(e) => {
              setCarbs(e.target.value)
              recalc(protein, e.target.value, fat)
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fat (g)</label>
          <input
            type="number"
            name="fat_g"
            value={fat}
            onChange={(e) => {
              setFat(e.target.value)
              recalc(protein, carbs, e.target.value)
            }}
            className={inputClass}
          />
        </div>
      </div>

      {/* Calories */}
      <div>
        <label className={labelClass}>Calories</label>
        <input
          type="number"
          name="calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-zinc-400 mt-1">
          Auto-calculated from macros — edit to override
        </p>
      </div>

      {/* Available toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_available"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="h-4 w-4 accent-[#C9A84C]"
        />
        <label htmlFor="is_available" className="text-sm text-zinc-600">
          Available (visible on public site)
        </label>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 rounded text-sm hover:bg-[#b8933d] disabled:opacity-60"
        >
          {pending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Item'}
        </button>
        <Link
          href="/admin/cafe"
          className="px-5 py-2.5 border border-zinc-300 text-zinc-600 rounded text-sm hover:bg-zinc-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
