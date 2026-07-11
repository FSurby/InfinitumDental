export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Sant når Supabase-nøkler er konfigurert. Når usant kjører hele appen
 * på lokale seed-data (demo-modus) slik at siden ser komplett ut uten
 * en live database.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
