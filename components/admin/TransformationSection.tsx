'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import ImageUpload from '@/components/admin/ImageUpload'
import {
  createTransformation,
  updateTransformation,
  deleteTransformation,
} from '@/app/admin/actions/transformations'
import type { Transformation } from '@/lib/supabase/types'

const GOAL_TYPES = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'athletic_performance', label: 'Athletic Performance' },
  { value: 'post_rehab', label: 'Post-Rehab' },
]

interface TransformationSectionProps {
  trainerId: string
  transformations: Transformation[]
}

export default function TransformationSection({
  trainerId,
  transformations,
}: TransformationSectionProps) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (window.confirm('Delete this transformation?')) {
      const result = await deleteTransformation(id)
      if (result && 'error' in result && result.error) {
        window.alert(`Delete failed: ${result.error}`)
        return
      }
      router.refresh()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-zinc-800">Transformations</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-sm text-[#C9A84C] border border-[#C9A84C]/40 rounded px-3 py-1.5 hover:bg-[#C9A84C]/10"
          >
            <Plus size={14} />
            Add Transformation
          </button>
        )}
      </div>

      {adding && (
        <TransformationForm
          trainerId={trainerId}
          onDone={() => {
            setAdding(false)
            router.refresh()
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-3 mt-3">
        {transformations.map((t) =>
          editingId === t.id ? (
            <TransformationForm
              key={t.id}
              trainerId={trainerId}
              transformation={t}
              onDone={() => {
                setEditingId(null)
                router.refresh()
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={t.id}
              className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-4"
            >
              {(t.before_image_url || t.after_image_url) && (
                <div className="flex gap-1">
                  {t.before_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.before_image_url}
                      alt="Before"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  {t.after_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.after_image_url}
                      alt="After"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </div>
              )}

              <div className="flex-1">
                <p className="font-medium text-zinc-800">{t.client_name}</p>
                <p className="text-sm text-zinc-500">
                  {t.goal} · {t.duration}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingId(t.id)}
                className="text-zinc-400 hover:text-[#C9A84C]"
                aria-label="Edit transformation"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-zinc-400 hover:text-red-500"
                aria-label="Delete transformation"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ),
        )}

        {transformations.length === 0 && !adding && (
          <p className="text-sm text-zinc-400">No transformations yet.</p>
        )}
      </div>
    </div>
  )
}

interface TransformationFormProps {
  trainerId: string
  transformation?: Transformation
  onDone: () => void
  onCancel: () => void
}

function TransformationForm({
  trainerId,
  transformation,
  onDone,
  onCancel,
}: TransformationFormProps) {
  const [beforeUrl, setBeforeUrl] = useState<string | null>(
    transformation?.before_image_url ?? null,
  )
  const [afterUrl, setAfterUrl] = useState<string | null>(
    transformation?.after_image_url ?? null,
  )
  const [testimonial, setTestimonial] = useState<string>(
    transformation?.testimonial ?? '',
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputClass =
    'w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]'
  const labelClass = 'text-sm text-zinc-600 mb-1 block'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('trainer_id', trainerId)
    fd.set('before_image_url', beforeUrl ?? '')
    fd.set('after_image_url', afterUrl ?? '')
    fd.set('testimonial', testimonial)

    const result = transformation
      ? await updateTransformation(transformation.id, fd)
      : await createTransformation(fd)

    if (result && 'error' in result && result.error) {
      setError(result.error)
      setPending(false)
    } else {
      onDone()
    }
  }

  return (
    <div className="border border-zinc-300 rounded-lg p-4 bg-white space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Client Name</label>
          <input
            type="text"
            name="client_name"
            defaultValue={transformation?.client_name}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Duration</label>
          <input
            type="text"
            name="duration"
            placeholder="12 weeks"
            defaultValue={transformation?.duration}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Goal</label>
          <input
            type="text"
            name="goal"
            placeholder="25kg lost"
            defaultValue={transformation?.goal}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Goal Type</label>
          <select
            name="goal_type"
            defaultValue={transformation?.goal_type ?? 'weight_loss'}
            className={inputClass}
          >
            {GOAL_TYPES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <ImageUpload
          bucket="transformation-images"
          currentUrl={beforeUrl}
          onUpload={setBeforeUrl}
          label="Before"
        />

        <ImageUpload
          bucket="transformation-images"
          currentUrl={afterUrl}
          onUpload={setAfterUrl}
          label="After"
        />

        <div>
          <label className={labelClass}>Testimonial</label>
          <textarea
            name="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            maxLength={250}
            rows={2}
            className={inputClass}
          />
          <p className="text-xs text-zinc-400">{testimonial.length}/250</p>
        </div>

        <div>
          <label className={labelClass}>Display Order</label>
          <input
            type="number"
            name="display_order"
            defaultValue={transformation?.display_order ?? 0}
            className={inputClass}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-[#C9A84C] text-zinc-950 rounded text-sm hover:bg-[#b8933d] disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
