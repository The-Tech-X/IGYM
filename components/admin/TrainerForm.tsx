'use client'

import { useState } from 'react'
import Link from 'next/link'

import ImageUpload from '@/components/admin/ImageUpload'
import TagInput from '@/components/admin/TagInput'
import AvailabilityEditor from '@/components/admin/AvailabilityEditor'
import { slugify } from '@/lib/utils/slugify'
import type { Trainer } from '@/lib/supabase/types'

interface TrainerFormProps {
  trainer?: Trainer
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export default function TrainerForm({ trainer, action }: TrainerFormProps) {
  const isEditMode = !!trainer

  const [imageUrl, setImageUrl] = useState<string | null>(
    trainer?.image_url ?? null,
  )
  const [specialties, setSpecialties] = useState<string[]>(
    trainer?.specialties ?? [],
  )
  const [certifications, setCertifications] = useState<string[]>(
    trainer?.certifications ?? [],
  )
  const [availability, setAvailability] = useState<
    Array<{ day: string; hours: string }>
  >(trainer?.availability ?? [])
  const [slug, setSlug] = useState<string>(trainer?.slug ?? '')
  const [isActive, setIsActive] = useState<boolean>(trainer?.is_active ?? true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('slug', slug)
    fd.set('image_url', imageUrl ?? '')
    fd.set('specialties', JSON.stringify(specialties))
    fd.set('certifications', JSON.stringify(certifications))
    fd.set('availability', JSON.stringify(availability))
    fd.set('is_active', isActive ? 'true' : 'false')

    const bio = [fd.get('bio_1'), fd.get('bio_2')]
      .filter((b) => b && (b as string).trim())
      .map((b) => (b as string).trim())
    fd.set('bio', JSON.stringify(bio))

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
          defaultValue={trainer?.name}
          required
          onChange={(e) => {
            if (!isEditMode) setSlug(slugify(e.target.value))
          }}
          className={inputClass}
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className={`${inputClass} font-mono`}
        />
      </div>

      {/* Role title */}
      <div>
        <label className={labelClass}>Role title</label>
        <input
          type="text"
          name="role"
          defaultValue={trainer?.role}
          placeholder="Head of Strength & Conditioning"
          required
          className={inputClass}
        />
      </div>

      {/* Specialty eyebrow */}
      <div>
        <label className={labelClass}>Specialty eyebrow</label>
        <input
          type="text"
          name="specialty_eyebrow"
          defaultValue={trainer?.specialty_eyebrow}
          placeholder="STRENGTH & CONDITIONING"
          required
          className={`${inputClass} uppercase`}
        />
      </div>

      {/* Portrait image */}
      <div>
        <ImageUpload
          bucket="trainer-images"
          currentUrl={imageUrl}
          onUpload={setImageUrl}
          label="Portrait"
        />
      </div>

      {/* Specialties */}
      <TagInput
        label="Specialties"
        tags={specialties}
        onChange={setSpecialties}
      />

      {/* Certifications */}
      <TagInput
        label="Certifications"
        tags={certifications}
        onChange={setCertifications}
      />

      {/* Bio paragraph 1 */}
      <div>
        <label className={labelClass}>Bio paragraph 1</label>
        <textarea
          name="bio_1"
          defaultValue={trainer?.bio?.[0] ?? ''}
          rows={3}
          className={inputClass}
        />
      </div>

      {/* Bio paragraph 2 */}
      <div>
        <label className={labelClass}>Bio paragraph 2</label>
        <textarea
          name="bio_2"
          defaultValue={trainer?.bio?.[1] ?? ''}
          rows={3}
          className={inputClass}
        />
      </div>

      {/* Availability */}
      <AvailabilityEditor slots={availability} onChange={setAvailability} />

      {/* Instagram handle */}
      <div>
        <label className={labelClass}>Instagram handle</label>
        <input
          type="text"
          name="instagram"
          defaultValue={trainer?.instagram ?? ''}
          placeholder="@handle"
          className={inputClass}
        />
      </div>

      {/* Display order */}
      <div>
        <label className={labelClass}>Display order</label>
        <input
          type="number"
          name="display_order"
          defaultValue={trainer?.display_order ?? 0}
          className={inputClass}
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 accent-[#C9A84C]"
        />
        <label htmlFor="is_active" className="text-sm text-zinc-600">
          Active (visible on public site)
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
          {pending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Trainer'}
        </button>
        <Link
          href="/admin/trainers"
          className="px-5 py-2.5 border border-zinc-300 text-zinc-600 rounded text-sm hover:bg-zinc-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
