import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cookieless anon client for PUBLIC, unauthenticated reads (published posts,
// active trainers, available menu items). Safe to use in generateStaticParams,
// generateMetadata, and statically-generated/ISR page components — unlike the
// cookie-based server client, it never calls next/headers `cookies()`, so it
// works at build time when there is no HTTP request.
//
// RLS still applies: this client can only read rows the public read policies
// expose. Never use it for admin writes — those need the authenticated session.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
