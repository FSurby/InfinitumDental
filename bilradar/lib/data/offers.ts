import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { brands as seedBrands, offers as seedOffers } from "@/lib/seed/data";
import { applyFilters, sortOffers } from "@/lib/utils/filters";
import type { Offer, OfferFilter } from "@/lib/types";

const brandSlugById = (id: string) =>
  seedBrands.find((b) => b.id === id)?.slug;

/** Henter tilbud filtrert/sortert. Supabase når konfigurert, ellers seed. */
export async function getOffers(filter: OfferFilter = {}): Promise<Offer[]> {
  if (!isSupabaseConfigured()) {
    return applyFilters(seedOffers, filter, brandSlugById);
  }

  const supabase = createClient();
  let query = supabase
    .from("offers")
    .select("*, brand:brands(*)")
    .eq("aktiv", true);

  if (filter.segment?.length) query = query.in("segment", filter.segment);
  if (filter.drivlinje?.length) query = query.in("drivlinje", filter.drivlinje);
  if (filter.tilbudstype?.length)
    query = query.in("tilbudstype", filter.tilbudstype);
  if (filter.minPris != null) query = query.gte("maanedspris", filter.minPris);
  if (filter.maxPris != null) query = query.lte("maanedspris", filter.maxPris);
  if (filter.maxBinding != null)
    query = query.lte("bindingstid_mnd", filter.maxBinding);

  const { data, error } = await query;
  if (error) {
    console.error("getOffers:", error.message);
    return [];
  }

  let offers = (data as Offer[]) ?? [];
  // Merkefilter i minne (join-slug), og sortering.
  if (filter.merke?.length) {
    offers = offers.filter((o) =>
      o.brand?.slug ? filter.merke!.includes(o.brand.slug) : false,
    );
  }
  return sortOffers(offers, filter.sort ?? "pris");
}

export async function getFeaturedOffers(limit = 6): Promise<Offer[]> {
  const offers = await getOffers({ sort: "populaere" });
  return offers.slice(0, limit);
}

export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  if (!isSupabaseConfigured()) {
    const o = seedOffers.find((x) => x.slug === slug) ?? null;
    return o && o.aktiv ? o : null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*, brand:brands(*)")
    .eq("slug", slug)
    .eq("aktiv", true)
    .maybeSingle();

  if (error) {
    console.error("getOfferBySlug:", error.message);
    return null;
  }
  return (data as Offer) ?? null;
}

/** Lignende tilbud: samme segment eller drivlinje, ikke samme bil. */
export async function getSimilarOffers(
  offer: Offer,
  limit = 3,
): Promise<Offer[]> {
  const all = await getOffers({ sort: "populaere" });
  return all
    .filter((o) => o.id !== offer.id)
    .filter(
      (o) => o.segment === offer.segment || o.drivlinje === offer.drivlinje,
    )
    .slice(0, limit);
}

export async function getAllOfferSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return seedOffers.filter((o) => o.aktiv).map((o) => o.slug);
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("offers")
    .select("slug")
    .eq("aktiv", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
