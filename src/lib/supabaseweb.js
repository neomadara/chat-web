import { initSupabase, getSupabase } from '../shared/lib/supabase'

initSupabase({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
})

export { getSupabase }