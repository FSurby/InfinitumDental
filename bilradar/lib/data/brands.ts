import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { brands as seedBrands } from "@/lib/seed/data";
import type { Brand } from "@/lib/types";

export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) {
    return [...seedBrands].sort((a, b) => a.navn.localeCompare(b.navn, "nb"));
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("navn");
  if (error) {
    console.error("getBrands:", error.message);
    return [];
  }
  return (data as Brand[]) ?? [];
}
