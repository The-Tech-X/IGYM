'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  BookOpen,
  Users,
  UtensilsCrossed,
  Settings,
  LogOut,
} from 'lucide-react'
import type { Role } from '@/lib/supabase/types'

interface SidebarProps {
  role: Role
  displayName: string
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/journal', label: 'Journal', icon: BookOpen },
  { href: '/admin/trainers', label: 'Trainers', icon: Users },
  { href: '/admin/cafe', label: 'Café', icon: UtensilsCrossed },
]

export default function Sidebar({ role, displayName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-zinc-950 flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-zinc-800">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-zinc-800">
        <span
          className="text-white text-xl tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          IGYM
        </span>
        <span className="block text-[9px] text-zinc-600 tracking-widest uppercase mt-0.5">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                active
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}

        {role === 'admin' && (
          <>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                pathname.startsWith('/admin/settings')
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Settings size={15} />
              Settings
            </Link>

            {pathname.startsWith('/admin/settings') && (
              <Link
                href="/admin/settings/profile"
                className={`block ml-7 px-3 py-2 rounded text-xs transition-colors ${
                  pathname === '/admin/settings/profile'
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                Profile
              </Link>
            )}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm text-zinc-200 truncate">{displayName}</p>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
              {role}
            </span>
          </div>
          <a
            href="/admin/sign-out"
            title="Sign out"
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 flex-shrink-0"
          >
            <LogOut size={15} />
          </a>
        </div>
      </div>
    </aside>
  )
}
