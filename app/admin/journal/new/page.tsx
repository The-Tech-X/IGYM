import Link from 'next/link'

import ArticleForm from '@/components/admin/ArticleForm'
import { createJournalPost } from '@/app/admin/actions/journal'

export default function NewArticlePage() {
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
        New Article
      </h1>
      <ArticleForm createAction={createJournalPost} />
    </div>
  )
}
