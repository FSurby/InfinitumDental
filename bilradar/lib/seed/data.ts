import type { Brand, Offer, Post, SalesStat } from "@/lib/types";

/**
 * Lokale seed-data. Kilde for demo-modus (uten Supabase) og speiler
 * innholdet i supabase/seed.sql. Bilder fra Unsplash, logoer fra Clearbit.
 */

// Lokale placeholder-bilder (public/cars/*.svg) – alltid tilgjengelig, ingen
// ekstern avhengighet. Bytt til ekte foto-URLer via admin når du er klar.
const IMG = {
  elbilSuv: "/cars/elbil.svg",
  elbilSedan: "/cars/sedan.svg",
  suv: "/cars/suv.svg",
  suv2: "/cars/suv-2.svg",
  kompakt: "/cars/kompakt.svg",
  smaabil: "/cars/smaabil.svg",
  stasjonsvogn: "/cars/stasjonsvogn.svg",
  premium: "/cars/premium.svg",
  premium2: "/cars/premium-2.svg",
  interior: "/cars/interior.svg",
  detalj: "/cars/detalj.svg",
};

export const brands: Brand[] = [
  { id: "b-tesla", navn: "Tesla", slug: "tesla", logo_url: "/brands/tesla.svg" },
  { id: "b-toyota", navn: "Toyota", slug: "toyota", logo_url: "/brands/toyota.svg" },
  { id: "b-vw", navn: "Volkswagen", slug: "volkswagen", logo_url: "/brands/volkswagen.svg" },
  { id: "b-volvo", navn: "Volvo", slug: "volvo", logo_url: "/brands/volvo.svg" },
  { id: "b-mg", navn: "MG", slug: "mg", logo_url: "/brands/mg.svg" },
  { id: "b-byd", navn: "BYD", slug: "byd", logo_url: "/brands/byd.svg" },
  { id: "b-skoda", navn: "Škoda", slug: "skoda", logo_url: "/brands/skoda.svg" },
  { id: "b-hyundai", navn: "Hyundai", slug: "hyundai", logo_url: "/brands/hyundai.svg" },
  { id: "b-kia", navn: "Kia", slug: "kia", logo_url: "/brands/kia.svg" },
  { id: "b-polestar", navn: "Polestar", slug: "polestar", logo_url: "/brands/polestar.svg" },
  { id: "b-nissan", navn: "Nissan", slug: "nissan", logo_url: "/brands/nissan.svg" },
  { id: "b-cupra", navn: "Cupra", slug: "cupra", logo_url: "/brands/cupra.svg" },
];

const brandBySlug = (slug: string) => brands.find((b) => b.slug === slug)!;

export const offers: Offer[] = [
  {
    id: "o-tesla-model-y",
    brand_id: "b-tesla",
    modell: "Model Y RWD",
    slug: "tesla-model-y-rwd",
    segment: "suv",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 3990,
    startleie: 45000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Tesla Norge",
    forhandler_url: "https://www.tesla.com/no_no",
    bilde_urls: [IMG.elbilSuv, IMG.interior, IMG.detalj],
    aktiv: true,
    popularitet: 98,
    opprettet: "2026-06-28T09:00:00Z",
  },
  {
    id: "o-toyota-yaris-cross",
    brand_id: "b-toyota",
    modell: "Yaris Cross Hybrid",
    slug: "toyota-yaris-cross-hybrid",
    segment: "kompakt",
    drivlinje: "hybrid",
    tilbudstype: "leasing",
    maanedspris: 2790,
    startleie: 29000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Toyota Oslo",
    forhandler_url: "https://www.toyota.no",
    bilde_urls: [IMG.kompakt, IMG.interior],
    aktiv: true,
    popularitet: 90,
    opprettet: "2026-06-30T09:00:00Z",
  },
  {
    id: "o-vw-id4",
    brand_id: "b-vw",
    modell: "ID.4 Pro",
    slug: "volkswagen-id4-pro",
    segment: "suv",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 3490,
    startleie: 39000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Møller Bil",
    forhandler_url: "https://www.vw.no",
    bilde_urls: [IMG.suv, IMG.interior, IMG.detalj],
    aktiv: true,
    popularitet: 84,
    opprettet: "2026-07-01T09:00:00Z",
  },
  {
    id: "o-volvo-ex30",
    brand_id: "b-volvo",
    modell: "EX30 Single Motor",
    slug: "volvo-ex30-single-motor",
    segment: "suv",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 3290,
    startleie: 35000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Volvo Bilia",
    forhandler_url: "https://www.volvocars.com/no",
    bilde_urls: [IMG.suv2, IMG.interior],
    aktiv: true,
    popularitet: 88,
    opprettet: "2026-07-03T09:00:00Z",
  },
  {
    id: "o-mg4",
    brand_id: "b-mg",
    modell: "MG4 Electric",
    slug: "mg4-electric",
    segment: "kompakt",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 2490,
    startleie: 25000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "MG Motor Norge",
    forhandler_url: "https://mgmotor.no",
    bilde_urls: [IMG.kompakt, IMG.detalj],
    aktiv: true,
    popularitet: 76,
    opprettet: "2026-06-20T09:00:00Z",
  },
  {
    id: "o-byd-atto3",
    brand_id: "b-byd",
    modell: "ATTO 3",
    slug: "byd-atto-3",
    segment: "suv",
    drivlinje: "elbil",
    tilbudstype: "leie",
    maanedspris: 4290,
    startleie: 0,
    bindingstid_mnd: 12,
    km_per_aar: 20000,
    forhandler: "BYD RSA",
    forhandler_url: "https://www.byd.com/no",
    bilde_urls: [IMG.elbilSuv, IMG.interior],
    aktiv: true,
    popularitet: 70,
    opprettet: "2026-07-05T09:00:00Z",
  },
  {
    id: "o-skoda-enyaq",
    brand_id: "b-skoda",
    modell: "Enyaq 85",
    slug: "skoda-enyaq-85",
    segment: "suv",
    drivlinje: "elbil",
    tilbudstype: "billån",
    // billån mappes til "lån" i typen – rettes under
    maanedspris: 5290,
    startleie: 80000,
    bindingstid_mnd: 60,
    km_per_aar: 0,
    forhandler: "Harald A. Møller",
    forhandler_url: "https://www.skoda.no",
    bilde_urls: [IMG.suv, IMG.detalj],
    aktiv: true,
    popularitet: 66,
    opprettet: "2026-06-18T09:00:00Z",
  } as unknown as Offer,
  {
    id: "o-hyundai-kona",
    brand_id: "b-hyundai",
    modell: "Kona Electric",
    slug: "hyundai-kona-electric",
    segment: "kompakt",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 3190,
    startleie: 30000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Hyundai Motor Norway",
    forhandler_url: "https://www.hyundai.no",
    bilde_urls: [IMG.kompakt, IMG.interior],
    aktiv: true,
    popularitet: 72,
    opprettet: "2026-06-25T09:00:00Z",
  },
  {
    id: "o-kia-ev6",
    brand_id: "b-kia",
    modell: "EV6 GT-Line",
    slug: "kia-ev6-gt-line",
    segment: "premium",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 4990,
    startleie: 55000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Kia Bilia",
    forhandler_url: "https://www.kia.com/no",
    bilde_urls: [IMG.premium, IMG.interior, IMG.detalj],
    aktiv: true,
    popularitet: 80,
    opprettet: "2026-07-02T09:00:00Z",
  },
  {
    id: "o-polestar-2",
    brand_id: "b-polestar",
    modell: "Polestar 2 Long Range",
    slug: "polestar-2-long-range",
    segment: "premium",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 4590,
    startleie: 50000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Polestar Oslo",
    forhandler_url: "https://www.polestar.com/no",
    bilde_urls: [IMG.elbilSedan, IMG.premium2],
    aktiv: true,
    popularitet: 74,
    opprettet: "2026-06-22T09:00:00Z",
  },
  {
    id: "o-nissan-leaf",
    brand_id: "b-nissan",
    modell: "Leaf",
    slug: "nissan-leaf",
    segment: "kompakt",
    drivlinje: "elbil",
    tilbudstype: "leie",
    maanedspris: 3690,
    startleie: 0,
    bindingstid_mnd: 12,
    km_per_aar: 20000,
    forhandler: "Nissan Norge",
    forhandler_url: "https://www.nissan.no",
    bilde_urls: [IMG.kompakt, IMG.detalj],
    aktiv: true,
    popularitet: 55,
    opprettet: "2026-06-10T09:00:00Z",
  },
  {
    id: "o-cupra-born",
    brand_id: "b-cupra",
    modell: "Born",
    slug: "cupra-born",
    segment: "kompakt",
    drivlinje: "elbil",
    tilbudstype: "leasing",
    maanedspris: 3390,
    startleie: 34000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Cupra Oslo",
    forhandler_url: "https://www.cupraofficial.no",
    bilde_urls: [IMG.premium2, IMG.interior],
    aktiv: true,
    popularitet: 68,
    opprettet: "2026-07-06T09:00:00Z",
  },
  {
    id: "o-toyota-corolla",
    brand_id: "b-toyota",
    modell: "Corolla Touring Sports",
    slug: "toyota-corolla-touring-sports",
    segment: "stasjonsvogn",
    drivlinje: "hybrid",
    tilbudstype: "leasing",
    maanedspris: 3590,
    startleie: 32000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Toyota Bergen",
    forhandler_url: "https://www.toyota.no",
    bilde_urls: [IMG.stasjonsvogn, IMG.interior],
    aktiv: true,
    popularitet: 62,
    opprettet: "2026-06-15T09:00:00Z",
  },
  {
    id: "o-vw-polo",
    brand_id: "b-vw",
    modell: "Polo Life",
    slug: "volkswagen-polo-life",
    segment: "småbil",
    drivlinje: "bensin",
    tilbudstype: "leasing",
    maanedspris: 2290,
    startleie: 22000,
    bindingstid_mnd: 36,
    km_per_aar: 15000,
    forhandler: "Møller Bil",
    forhandler_url: "https://www.vw.no",
    bilde_urls: [IMG.smaabil, IMG.detalj],
    aktiv: true,
    popularitet: 50,
    opprettet: "2026-06-12T09:00:00Z",
  },
  {
    id: "o-volvo-v60",
    brand_id: "b-volvo",
    modell: "V60 B4 mild-hybrid",
    slug: "volvo-v60-b4",
    segment: "stasjonsvogn",
    drivlinje: "hybrid",
    tilbudstype: "billån",
    maanedspris: 5990,
    startleie: 90000,
    bindingstid_mnd: 60,
    km_per_aar: 0,
    forhandler: "Volvo Bilia",
    forhandler_url: "https://www.volvocars.com/no",
    bilde_urls: [IMG.stasjonsvogn, IMG.premium2],
    aktiv: true,
    popularitet: 58,
    opprettet: "2026-06-08T09:00:00Z",
  } as unknown as Offer,
];

// Normaliser tilbudstype "billån" -> "lån" (seed-input-alias).
for (const o of offers) {
  if ((o.tilbudstype as string) === "billån") o.tilbudstype = "lån";
  o.brand = brands.find((b) => b.id === o.brand_id);
}

export const posts: Post[] = [
  {
    id: "p-leasing-guide",
    tittel: "Leasing eller billån i 2026? Slik velger du riktig",
    slug: "leasing-eller-billan-2026",
    utdrag:
      "Privatleasing har eksplodert i popularitet, men er det alltid det smarteste? Vi bryter ned totalkostnaden, restverdi og fleksibilitet.",
    cover_url: "/blog/leasing-guide.svg",
    kategori: "Kjøpsguide",
    tags: ["leasing", "billån", "økonomi"],
    publisert: true,
    opprettet: "2026-07-04T08:00:00Z",
    innhold: `## Hva er forskjellen?

Ved **privatleasing** betaler du en fast månedspris for å bruke bilen i en avtalt periode – typisk 36 måneder – uten å eie den. Ved **billån** kjøper du bilen og nedbetaler et lån, og sitter igjen med en verdi når lånet er nedbetalt.

## Totalkostnad over tid

Det viktigste er å regne på totalkostnaden, ikke bare månedsprisen. På en leasingavtale legger du sammen startleie og alle månedlige betalinger. På et billån må du ta høyde for renter, avdrag og forventet verdifall.

- **Leasing** passer deg som vil ha forutsigbarhet og alltid kjøre ny bil.
- **Billån** passer deg som kjører mye, vil eie bilen og beholde den lenge.

## Sjekk kjørelengden

Leasingavtaler har en inkludert kilometergrense. Kjører du mer enn avtalt, kommer det et tillegg per kilometer. Kjører du 25 000 km i året, kan et billån fort bli billigere.

> Tommelfingerregel: Under 15 000 km/år og hyppig bilbytte favoriserer leasing. Over det, og et ønske om å eie, favoriserer billån.`,
  },
  {
    id: "p-elbil-vinter",
    tittel: "Elbil om vinteren: Dette taper du på rekkevidden",
    slug: "elbil-vinter-rekkevidde",
    utdrag:
      "Kulde stjeler rekkevidde. Vi tester hvor mye du realistisk mister på norske vinterveier – og hva du kan gjøre med det.",
    cover_url: "/blog/elbil-vinter.svg",
    kategori: "Test",
    tags: ["elbil", "vinter", "rekkevidde"],
    publisert: true,
    opprettet: "2026-06-27T08:00:00Z",
    innhold: `## Kulden koster

De fleste elbiler mister mellom **15 og 30 %** av rekkevidden når temperaturen kryper under null. Årsaken er todelt: batteriet jobber tyngre i kulde, og oppvarming av kupéen trekker mye strøm.

## Slik minimerer du tapet

1. **Forvarm bilen på lading.** Da bruker du strøm fra veggen, ikke batteriet.
2. **Bruk setevarme fremfor kupévarme.** Det er langt mer energieffektivt.
3. **Planlegg lading.** Et forvarmet batteri lader raskere på hurtiglader.

## Hvilke biler klarer seg best?

Biler med varmepumpe kommer klart best ut. Sjekk alltid om varmepumpe er standard eller tilvalg før du signerer avtalen.`,
  },
  {
    id: "p-mest-solgte",
    tittel: "Disse bilene dominerer det norske markedet i 2026",
    slug: "mest-solgte-biler-norge-2026",
    utdrag:
      "Tesla og Volkswagen kjemper i toppen, men et kinesisk merke klatrer raskt. Her er trendene bak registreringstallene.",
    cover_url: "/blog/mest-solgte.svg",
    kategori: "Nyheter",
    tags: ["statistikk", "marked", "elbil"],
    publisert: true,
    opprettet: "2026-07-08T08:00:00Z",
    innhold: `## Elbilen er normen

Over 9 av 10 nye personbiler i Norge er nå elektriske. Overgangen som en gang virket fjern, er i praksis fullført for privatmarkedet.

## Kina tar markedsandeler

Merker som **BYD** og **MG** vokser raskt takket være konkurransedyktige priser og godt utstyr. De utfordrer nå etablerte europeiske og japanske merker direkte.

## Hva betyr det for deg?

Mer konkurranse betyr bedre tilbud. Vi ser stadig skarpere leasingpriser og kampanjer – noe som gjør det til et godt tidspunkt å forhandle.`,
  },
];

// Salgsstatistikk: to måneder for å vise endring (pil opp/ned).
const forrigeMaaned = "2026-05-01";
const denneMaaned = "2026-06-01";

const salgTopp: Array<{
  brandSlug: string;
  modell: string;
  denne: number;
  forrige: number;
}> = [
  { brandSlug: "tesla", modell: "Model Y", denne: 2410, forrige: 2180 },
  { brandSlug: "volkswagen", modell: "ID.4", denne: 1320, forrige: 1400 },
  { brandSlug: "toyota", modell: "bZ4X / Yaris Cross", denne: 1180, forrige: 1090 },
  { brandSlug: "volvo", modell: "EX30", denne: 1105, forrige: 860 },
  { brandSlug: "byd", modell: "ATTO 3 / Seal", denne: 980, forrige: 640 },
  { brandSlug: "skoda", modell: "Enyaq", denne: 870, forrige: 900 },
  { brandSlug: "hyundai", modell: "Kona / Ioniq", denne: 760, forrige: 780 },
  { brandSlug: "mg", modell: "MG4", denne: 720, forrige: 590 },
  { brandSlug: "kia", modell: "EV6 / Niro", denne: 690, forrige: 710 },
  { brandSlug: "nissan", modell: "Ariya / Leaf", denne: 540, forrige: 505 },
];

export const salesStats: SalesStat[] = salgTopp.map((s, i) => ({
  id: `s-${s.brandSlug}`,
  brand_id: brandBySlug(s.brandSlug).id,
  modell: s.modell,
  maaned: denneMaaned,
  antall_registreringer: s.denne,
  plassering: i + 1,
  forrige_registreringer: s.forrige,
  brand: brandBySlug(s.brandSlug),
}));

export const salesMonthLabel = "Juni 2026";
export const salesPrevMonth = forrigeMaaned;
