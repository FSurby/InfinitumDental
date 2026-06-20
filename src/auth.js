import { supabase } from './storage.js'

export async function authRegister({ email, password, name, phone, address, accountType, companyName, orgNumber }) {
  if (!supabase) throw new Error('Supabase ikke konfigurert')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  const userId = data.user?.id
  if (userId) {
    await supabase.from('profiles').upsert({
      id: userId,
      name: name || '',
      phone: phone || '',
      address: address || '',
      account_type: accountType || 'private',
      company_name: companyName || '',
      org_number: orgNumber || '',
    })
  }
  return data.user
}

export async function authLogin({ email, password }) {
  if (!supabase) throw new Error('Supabase ikke konfigurert')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function authLogout() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function fetchProfile(userId) {
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfile(userId, fields) {
  if (!supabase) return
  await supabase.from('profiles').upsert({ id: userId, ...fields })
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}
