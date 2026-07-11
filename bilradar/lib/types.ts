export type Segment =
  | "småbil"
  | "kompakt"
  | "suv"
  | "stasjonsvogn"
  | "premium";

export type Drivlinje = "elbil" | "hybrid" | "bensin" | "diesel";

export type Tilbudstype = "leasing" | "lån" | "leie";

export interface Brand {
  id: string;
  navn: string;
  slug: string;
  logo_url: string | null;
}

export interface Offer {
  id: string;
  brand_id: string;
  modell: string;
  slug: string;
  segment: Segment;
  drivlinje: Drivlinje;
  tilbudstype: Tilbudstype;
  maanedspris: number;
  startleie: number;
  bindingstid_mnd: number;
  km_per_aar: number;
  forhandler: string;
  forhandler_url: string | null;
  bilde_urls: string[];
  aktiv: boolean;
  popularitet: number;
  opprettet: string;
  // Denormalisert for visning (fylles fra join eller seed)
  brand?: Brand;
}

export interface Post {
  id: string;
  tittel: string;
  slug: string;
  innhold: string;
  utdrag: string;
  cover_url: string | null;
  kategori: string;
  tags: string[];
  publisert: boolean;
  opprettet: string;
}

export interface SalesStat {
  id: string;
  brand_id: string;
  modell: string;
  maaned: string; // ISO date (første i måneden)
  antall_registreringer: number;
  plassering: number;
  // Endring vs. forrige måned (utledet)
  forrige_registreringer?: number;
  brand?: Brand;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export type SortKey = "pris" | "nyeste" | "populaere";

export interface OfferFilter {
  merke?: string[]; // brand slugs
  segment?: Segment[];
  drivlinje?: Drivlinje[];
  tilbudstype?: Tilbudstype[];
  minPris?: number;
  maxPris?: number;
  maxBinding?: number;
  sort?: SortKey;
}
