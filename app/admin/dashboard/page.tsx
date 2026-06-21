import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, UtensilsCrossed, FileText } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  const [trainers, published, drafts, cafe] = await Promise.all([
    supabase
      .from('trainers')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('journal_posts')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase
      .from('journal_posts')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', false),
    supabase
      .from('cafe_menu_items')
      .select('id', { count: 'exact', head: true })
      .eq('is_available', true),
  ])
  return {
    trainers: trainers.count ?? 0,
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
    cafe: cafe.count ?? 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    {
      label: 'Published Articles',
      value: stats.published,
      icon: BookOpen,
      href: '/admin/journal',
    },
    {
      label: 'Draft Articles',
      value: stats.drafts,
      icon: FileText,
      href: '/admin/journal',
    },
    {
      label: 'Active Trainers',
      value: stats.trainers,
      icon: Users,
      href: '/admin/trainers',
    },
    {
      label: 'Menu Items',
      value: stats.cafe,
      icon: UtensilsCrossed,
      href: '/admin/cafe',
    },
  ]

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1
          className="text-2xl font-light text-zinc-800 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your content</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-[#C9A84C]/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon
                size={16}
                className="text-zinc-400 group-hover:text-[#C9A84C] transition-colors"
              />
            </div>
            <p className="text-3xl font-light text-zinc-800">{value}</p>
            <p className="text-xs text-zinc-500 mt-1 tracking-wide">{label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xs text-zinc-400 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/admin/journal/new"
            className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors"
          >
            New Article
          </Link>
          <Link
            href="/admin/trainers"
            className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm rounded tracking-wide hover:bg-zinc-50 transition-colors"
          >
            Edit Trainers
          </Link>
          <Link
            href="/admin/cafe"
            className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm rounded tracking-wide hover:bg-zinc-50 transition-colors"
          >
            Manage Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
