'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  bucket: string
  currentUrl: string | null
  onUpload: (url: string) => void
  label?: string
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

export default function ImageUpload({
  bucket,
  currentUrl,
  onUpload,
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP allowed')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be under 5MB')
      return
    }

    setUploading(true)

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
    const supabase = createClient()

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filename)

    onUpload(publicUrl)
    setPreview(publicUrl)
    setUploading(false)
  }

  function openPicker() {
    if (uploading) return
    inputRef.current?.click()
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  return (
    <div>
      {label && <p className="text-sm text-zinc-600 mb-1">{label}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />

      {preview ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border border-zinc-300"
          />
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="mt-2 block text-sm text-[#C9A84C] disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Change image'}
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openPicker()
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 bg-white rounded p-6 cursor-pointer hover:border-[#C9A84C] transition-colors"
        >
          <ImagePlus size={24} className="text-zinc-400" />
          <span className="text-sm text-zinc-500">
            {uploading ? 'Uploading…' : 'Click or drag to upload'}
          </span>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
