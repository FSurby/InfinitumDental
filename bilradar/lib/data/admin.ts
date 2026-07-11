import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  offers as seedOffers,
  posts as seedPosts,
  brands as seedBrands,
} from "@/lib/seed/data";
import type { Offer, Post } from "@/lib/types";

/** Alle tilbud (inkl. inaktive) for admin. */
export async function getAllOffersAdmin(): Promise<Offer[]> {
  if (!isSupabaseConfigured()) {
    return [...seedOffers].sort((a, b) =>
      (a.brand?.navn ?? "").localeCompare(b.brand?.navn ?? "", "nb"),
    );
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("offers")
    .select("*, brand:brands(*)")
    .order("opprettet", { ascending: false });
  return (data as Offer[]) ?? [];
}

export async function getOfferByIdAdmin(id: string): Promise<Offer | null> {
  if (!isSupabaseConfigured()) {
    return seedOffers.find((o) => o.id === id) ?? null;
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("offers")
    .select("*, brand:brands(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Offer) ?? null;
}

/** Alle artikler (inkl. upubliserte) for admin. */
export async function getAllPostsAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return [...seedPosts].sort(
      (a, b) =>
        new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime(),
    );
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("opprettet", { ascending: false });
  return (data as Post[]) ?? [];
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return seedPosts.find((p) => p.id === id) ?? null;
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Post) ?? null;
}

export async function getStatsSummary() {
  if (!isSupabaseConfigured()) {
    return {
      aktiveTilbud: seedOffers.filter((o) => o.aktiv).length,
      totaltTilbud: seedOffers.length,
      publiserteArtikler: seedPosts.filter((p) => p.publisert).length,
      merker: seedBrands.length,
    };
  }
  const supabase = createClient();
  const [aktive, totalt, publiserte, merker] = await Promise.all([
    supabase
      .from("offers")
      .select("id", { count: "exact", head: true })
      .eq("aktiv", true),
    supabase.from("offers").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("publisert", true),
    supabase.from("brands").select("id", { count: "exact", head: true }),
  ]);
  return {
    aktiveTilbud: aktive.count ?? 0,
    totaltTilbud: totalt.count ?? 0,
    publiserteArtikler: publiserte.count ?? 0,
    merker: merker.count ?? 0,
  };
}
