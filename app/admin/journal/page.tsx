import Link from 'next/link'
import { getJournalPosts, deleteJournalPost } from '@/app/admin/actions/journal'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function JournalPage() {
  const posts = await getJournalPosts()

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-2xl font-light text-zinc-800"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Journal
          </h1>
          <p className="text-sm text-zinc-500">
            {posts.length} article{posts.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors"
        >
          New Article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-lg p-12 text-center text-zinc-500">
          <p>No articles yet.</p>
          <Link href="/admin/journal/new" className="text-[#C9A84C] hover:underline">
            Write your first article.
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-zinc-800 font-medium truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {post.is_published && post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Draft'}
                  </span>
                </div>
              </div>

              {post.is_published ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  Published
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                  Draft
                </span>
              )}

              <Link
                href={`/admin/journal/${post.id}/edit`}
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Edit
              </Link>

              <DeleteButton
                action={async () => {
                  'use server'
                  return await deleteJournalPost(post.id!)
                }}
                confirmMessage={`Delete "${post.title}"? This cannot be undone.`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
