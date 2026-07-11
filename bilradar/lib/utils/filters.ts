import type {
  Drivlinje,
  Offer,
  OfferFilter,
  Segment,
  SortKey,
  Tilbudstype,
} from "@/lib/types";

export const SEGMENTS: Segment[] = [
  "småbil",
  "kompakt",
  "suv",
  "stasjonsvogn",
  "premium",
];
export const DRIVLINJER: Drivlinje[] = ["elbil", "hybrid", "bensin", "diesel"];
export const TILBUDSTYPER: Tilbudstype[] = ["leasing", "lån", "leie"];
export const BINDING_OPTIONS = [12, 24, 36, 48, 60];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pris", label: "Lavest månedspris" },
  { value: "nyeste", label: "Nyeste tilbud" },
  { value: "populaere", label: "Mest populære" },
];

export const PRICE_MIN = 1500;
export const PRICE_MAX = 7000;

type SearchParams = Record<string, string | string[] | undefined>;

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : v.split(",").filter(Boolean);
}

/** Bygger et OfferFilter fra URL searchParams. */
export function parseFilters(sp: SearchParams): OfferFilter {
  const merke = toArray(sp.merke);
  const segment = toArray(sp.segment) as Segment[];
  const drivlinje = toArray(sp.drivlinje) as Drivlinje[];
  const tilbudstype = toArray(sp.tilbudstype) as Tilbudstype[];
  const minPris = sp.minPris ? Number(sp.minPris) : undefined;
  const maxPris = sp.maxPris ? Number(sp.maxPris) : undefined;
  const maxBinding = sp.maxBinding ? Number(sp.maxBinding) : undefined;
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as
    | SortKey
    | undefined;

  return {
    merke: merke.length ? merke : undefined,
    segment: segment.length ? segment : undefined,
    drivlinje: drivlinje.length ? drivlinje : undefined,
    tilbudstype: tilbudstype.length ? tilbudstype : undefined,
    minPris: Number.isFinite(minPris) ? minPris : undefined,
    maxPris: Number.isFinite(maxPris) ? maxPris : undefined,
    maxBinding: Number.isFinite(maxBinding) ? maxBinding : undefined,
    sort: sort ?? "pris",
  };
}

/** Serialiserer et filter til URLSearchParams for delbare lenker. */
export function filtersToSearchParams(f: OfferFilter): URLSearchParams {
  const p = new URLSearchParams();
  if (f.merke?.length) p.set("merke", f.merke.join(","));
  if (f.segment?.length) p.set("segment", f.segment.join(","));
  if (f.drivlinje?.length) p.set("drivlinje", f.drivlinje.join(","));
  if (f.tilbudstype?.length) p.set("tilbudstype", f.tilbudstype.join(","));
  if (f.minPris != null) p.set("minPris", String(f.minPris));
  if (f.maxPris != null) p.set("maxPris", String(f.maxPris));
  if (f.maxBinding != null) p.set("maxBinding", String(f.maxBinding));
  if (f.sort && f.sort !== "pris") p.set("sort", f.sort);
  return p;
}

export function countActiveFilters(f: OfferFilter): number {
  return (
    (f.merke?.length ?? 0) +
    (f.segment?.length ?? 0) +
    (f.drivlinje?.length ?? 0) +
    (f.tilbudstype?.length ?? 0) +
    (f.minPris != null ? 1 : 0) +
    (f.maxPris != null ? 1 : 0) +
    (f.maxBinding != null ? 1 : 0)
  );
}

/**
 * Filtrerer og sorterer en liste tilbud i minne. Brukes av seed-fallback
 * (samme logikk som Supabase-spørringen skal reflektere).
 * `brandSlugById` mapper brand_id -> slug for merkefilteret.
 */
export function applyFilters(
  offers: Offer[],
  f: OfferFilter,
  brandSlugById: (id: string) => string | undefined,
): Offer[] {
  let result = offers.filter((o) => o.aktiv);

  if (f.merke?.length) {
    result = result.filter((o) => {
      const slug = o.brand?.slug ?? brandSlugById(o.brand_id);
      return slug ? f.merke!.includes(slug) : false;
    });
  }
  if (f.segment?.length) {
    result = result.filter((o) => f.segment!.includes(o.segment));
  }
  if (f.drivlinje?.length) {
    result = result.filter((o) => f.drivlinje!.includes(o.drivlinje));
  }
  if (f.tilbudstype?.length) {
    result = result.filter((o) => f.tilbudstype!.includes(o.tilbudstype));
  }
  if (f.minPris != null) {
    result = result.filter((o) => o.maanedspris >= f.minPris!);
  }
  if (f.maxPris != null) {
    result = result.filter((o) => o.maanedspris <= f.maxPris!);
  }
  if (f.maxBinding != null) {
    result = result.filter((o) => o.bindingstid_mnd <= f.maxBinding!);
  }

  return sortOffers(result, f.sort ?? "pris");
}

export function sortOffers(offers: Offer[], sort: SortKey): Offer[] {
  const arr = [...offers];
  switch (sort) {
    case "nyeste":
      return arr.sort(
        (a, b) =>
          new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime(),
      );
    case "populaere":
      return arr.sort((a, b) => b.popularitet - a.popularitet);
    case "pris":
    default:
      return arr.sort((a, b) => a.maanedspris - b.maanedspris);
  }
}
