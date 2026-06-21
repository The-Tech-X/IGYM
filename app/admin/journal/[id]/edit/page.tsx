import Link from 'next/link'
import { notFound } from 'next/navigation'

import ArticleForm from '@/components/admin/ArticleForm'
import { getJournalPost, updateJournalPost } from '@/app/admin/actions/journal'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const post = await getJournalPost(id)

  if (!post) notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href="/admin/journal"
        className="text-sm text-zinc-500 hover:text-zinc-700 mb-6 inline-block"
      >
        ← Back to Journal
      </Link>
      <h1
        className="text-2xl font-light text-zinc-800 mb-6"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        <span className="block truncate">{post.title}</span>
      </h1>
      <ArticleForm post={post} updateAction={updateJournalPost.bind(null, id)} />
    </div>
  )
}
