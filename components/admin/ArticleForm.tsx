'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import TipTapEditor from '@/components/admin/TipTapEditor'
import ImageUpload from '@/components/admin/ImageUpload'
import { slugify } from '@/lib/utils/slugify'
import { unpublishPost, autosaveJournalPost } from '@/app/admin/actions/journal'
import type { JournalPost } from '@/lib/supabase/types'

interface ArticleFormProps {
  post?: JournalPost
  createAction?: (formData: FormData) => Promise<{ error?: string } | void>
  updateAction?: (formData: FormData) => Promise<{ error?: string } | void>
}

const CATEGORIES = ['Training', 'Nutrition', 'Mindset', 'Recovery']

const inputClass =
  'w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]'
const labelClass = 'text-sm text-zinc-600 mb-1 block'

export default function ArticleForm({
  post,
  createAction,
  updateAction,
}: ArticleFormProps) {
  const isEditMode = !!post
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [tab, setTab] = useState<'content' | 'seo'>('content')
  const [body, setBody] = useState<Record<string, unknown>>(
    post?.body ?? { type: 'doc', content: [] },
  )
  const [wordCount, setWordCount] = useState(0)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    post?.cover_image_url ?? null,
  )
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string | null>(
    post?.author_avatar_url ?? null,
  )
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(
    post?.og_image_url ?? null,
  )
  const [slug, setSlug] = useState<string>(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState<string>(post?.excerpt ?? '')
  const [metaTitle, setMetaTitle] = useState<string>(post?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState<string>(
    post?.meta_description ?? '',
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  // Mirror of the controlled state, refreshed every render. The auto-save
  // interval reads from this ref so it always sees the latest values without
  // having to list every field as an effect dependency (which would reset the
  // 30s timer on every keystroke).
  const latest = useRef({
    body,
    slug,
    excerpt,
    metaTitle,
    metaDescription,
    coverImageUrl,
    authorAvatarUrl,
    ogImageUrl,
    readTime,
  })
  latest.current = {
    body,
    slug,
    excerpt,
    metaTitle,
    metaDescription,
    coverImageUrl,
    authorAvatarUrl,
    ogImageUrl,
    readTime,
  }

  function buildFormData(isPublished: boolean): FormData {
    // Title, Category, Author Name, Canonical URL are uncontrolled inputs with
    // name attributes and are captured here. All tab panels stay mounted (see
    // the `hidden` class toggling below) so FormData always has every field.
    const s = latest.current
    const fd = new FormData(formRef.current!)
    fd.set('slug', s.slug)
    fd.set('excerpt', s.excerpt)
    fd.set('meta_title', s.metaTitle)
    fd.set('meta_description', s.metaDescription)
    fd.set('cover_image_url', s.coverImageUrl ?? '')
    fd.set('author_avatar_url', s.authorAvatarUrl ?? '')
    fd.set('og_image_url', s.ogImageUrl ?? '')
    fd.set('body', JSON.stringify(s.body))
    fd.set('read_time_minutes', String(s.readTime))
    fd.set('is_published', isPublished ? 'true' : 'false')
    return fd
  }

  async function save(isPublished: boolean) {
    setPending(true)
    setError(null)
    const action = isEditMode ? updateAction : createAction
    if (!action) {
      setPending(false)
      return
    }
    const result = await action(buildFormData(isPublished))
    if (result && result.error) {
      setError(result.error)
      setPending(false)
    }
    // On success the action redirects, so no further handling is needed.
  }

  const handleSaveDraft = () => save(false)
  const handlePublish = () => save(true)

  async function handleUnpublish() {
    if (!post) return
    await unpublishPost(post.id)
    router.refresh()
  }

  // Auto-save every 30s in edit mode. Uses autosaveJournalPost (a
  // non-redirecting variant) so the editor is never navigated away mid-edit.
  // Preserves the post's current published state during the silent save.
  useEffect(() => {
    if (!isEditMode || !post) return
    const interval = setInterval(async () => {
      const result = await autosaveJournalPost(
        post.id,
        buildFormData(post.is_published),
      )
      if (!('error' in result)) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 2000)
      }
    }, 30000)
    return () => clearInterval(interval)
    // Stable interval: buildFormData reads current values from `latest.current`,
    // so the timer must NOT reset on every keystroke. Depends only on identity
    // of edit mode and post.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, post])

  return (
    <div className="max-w-2xl">
      {/* Tab switcher */}
      <div className="flex gap-6 border-b border-zinc-200 mb-6">
        <button
          type="button"
          onClick={() => setTab('content')}
          className={`pb-2 -mb-px text-sm border-b-2 ${
            tab === 'content'
              ? 'border-[#C9A84C] text-[#C9A84C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setTab('seo')}
          className={`pb-2 -mb-px text-sm border-b-2 ${
            tab === 'seo'
              ? 'border-[#C9A84C] text-[#C9A84C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          SEO
        </button>
        {savedFlash && (
          <span className="ml-auto self-center text-xs text-zinc-400">
            Saved
          </span>
        )}
      </div>

      {/* Both panels stay mounted; we toggle visibility with `hidden` so that
          new FormData(formRef.current) always captures every field. */}
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        {/* Content panel */}
        <div className={tab === 'content' ? 'space-y-5' : 'hidden'}>
          {/* Title */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
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

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              name="category"
              defaultValue={post?.category ?? 'Training'}
              className={inputClass}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={160}
              rows={2}
              className={inputClass}
            />
            <p className="text-xs text-zinc-400 mt-1">{excerpt.length}/160</p>
          </div>

          {/* Cover Image */}
          <div>
            <ImageUpload
              bucket="article-images"
              currentUrl={coverImageUrl}
              onUpload={setCoverImageUrl}
              label="Cover Image"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className={labelClass}>Author Name</label>
            <input
              type="text"
              name="author_name"
              defaultValue={post?.author_name}
              required
              className={inputClass}
            />
          </div>

          {/* Author Avatar */}
          <div>
            <ImageUpload
              bucket="avatars"
              currentUrl={authorAvatarUrl}
              onUpload={setAuthorAvatarUrl}
              label="Author Avatar"
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelClass}>Article Body</label>
            <TipTapEditor
              content={body}
              onChange={(json, wc) => {
                setBody(json)
                setWordCount(wc)
              }}
            />
            <p className="text-xs text-zinc-400 mt-1">~{readTime} min read</p>
          </div>
        </div>

        {/* SEO panel */}
        <div className={tab === 'seo' ? 'space-y-5' : 'hidden'}>
          {/* Meta Title */}
          <div>
            <label className={labelClass}>Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={60}
              placeholder={post?.title ?? 'Article title'}
              className={inputClass}
            />
            <p className="text-xs text-zinc-400 mt-1">{metaTitle.length}/60</p>
          </div>

          {/* Meta Description */}
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              rows={2}
              placeholder="Defaults to excerpt"
              className={inputClass}
            />
            <p className="text-xs text-zinc-400 mt-1">
              {metaDescription.length}/160
            </p>
          </div>

          {/* OG Image */}
          <div>
            <ImageUpload
              bucket="article-images"
              currentUrl={ogImageUrl}
              onUpload={setOgImageUrl}
              label="OG Image"
            />
            <p className="text-xs text-zinc-400 mt-1">
              Defaults to cover image if empty
            </p>
          </div>

          {/* Canonical URL */}
          <div>
            <label className={labelClass}>Canonical URL</label>
            <input
              type="text"
              name="canonical_url"
              defaultValue={post?.canonical_url ?? ''}
              placeholder={`https://igym.in/journal/${slug || '[slug]'}`}
              className={inputClass}
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-6">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3 items-center mt-6">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={pending}
            className="px-5 py-2.5 border border-zinc-300 text-zinc-600 rounded text-sm hover:bg-zinc-50 disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={pending}
            className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 rounded text-sm hover:bg-[#b8933d] disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Publish'}
          </button>
          {isEditMode && post.is_published && (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={pending}
              className="px-5 py-2.5 border border-zinc-300 text-zinc-500 rounded text-sm hover:bg-zinc-50 disabled:opacity-60"
            >
              Unpublish
            </button>
          )}
          <Link
            href="/admin/journal"
            className="px-5 py-2.5 text-zinc-500 rounded text-sm hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
