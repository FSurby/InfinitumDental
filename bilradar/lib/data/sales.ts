import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { salesStats as seedStats } from "@/lib/seed/data";
import type { SalesStat } from "@/lib/types";

/** Topp mest solgte merker/modeller inneværende måned, sortert på plassering. */
export async function getTopSales(limit = 10): Promise<SalesStat[]> {
  if (!isSupabaseConfigured()) {
    return [...seedStats]
      .sort((a, b) => a.plassering - b.plassering)
      .slice(0, limit);
  }

  const supabase = createClient();
  // Finn nyeste måned.
  const { data: latest } = await supabase
    .from("sales_stats")
    .select("maaned")
    .order("maaned", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest?.maaned) return [];

  const { data, error } = await supabase
    .from("sales_stats")
    .select("*, brand:brands(*)")
    .eq("maaned", latest.maaned)
    .order("plassering")
    .limit(limit);

  if (error) {
    console.error("getTopSales:", error.message);
    return [];
  }
  return (data as SalesStat[]) ?? [];
}
