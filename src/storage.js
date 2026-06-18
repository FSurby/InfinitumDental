import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// In-memory fallback when Supabase is not configured
const memStore = {}

export const storage = {
  async get(key, shared = false) {
    const storeKey = shared ? `shared:${key}` : `user:${key}`
    if (!supabase) return memStore[storeKey] ?? null
    const { data } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', storeKey)
      .single()
    if (!data) return null
    try { return JSON.parse(data.value) } catch { return data.value }
  },

  async set(key, value, shared = false) {
    const storeKey = shared ? `shared:${key}` : `user:${key}`
    const serialized = JSON.stringify(value)
    if (!supabase) { memStore[storeKey] = value; return }
    await supabase.from('kv_store').upsert(
      { key: storeKey, value: serialized, shared: !!shared },
      { onConflict: 'key' }
    )
  },

  async delete(key, shared = false) {
    const storeKey = shared ? `shared:${key}` : `user:${key}`
    if (!supabase) { delete memStore[storeKey]; return }
    await supabase.from('kv_store').delete().eq('key', storeKey)
  },
}
