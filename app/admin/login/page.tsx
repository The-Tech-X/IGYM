'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })

    if (authError) {
      setError(authError.message)
      setPending(false)
      return
    }

    // Hard redirect ensures session cookies are flushed to the browser
    // before the dashboard request is made
    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-light tracking-[0.3em] text-white uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            IGYM
          </h1>
          <p className="text-[11px] tracking-widest text-zinc-500 uppercase mt-1">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-zinc-900 p-8 rounded-lg border border-zinc-800"
        >
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] tracking-widest text-zinc-500 uppercase">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder:text-zinc-600"
              placeholder="admin@igym.in"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] tracking-widest text-zinc-500 uppercase">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#C9A84C] text-zinc-950 py-3 text-[11px] font-medium rounded tracking-[0.2em] uppercase disabled:opacity-60 hover:bg-[#b8933d] transition-colors mt-2"
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
