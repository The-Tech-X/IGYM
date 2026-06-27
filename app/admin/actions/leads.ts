'use server'

import { createClient } from '@/lib/supabase/server'
import type { Lead } from '@/lib/supabase/types'

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}
