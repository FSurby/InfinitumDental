const nok = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("nb-NO");

/** Formaterer beløp som norske kroner, f.eks. "3 990 kr". */
export function formatKr(value: number): string {
  // Bruk "kr" etter tallet (norsk konvensjon) i stedet for "NOK".
  return `${num.format(Math.round(value))} kr`;
}

/** Formaterer valuta med fullt format (fallback). */
export function formatNOK(value: number): string {
  return nok.format(value);
}

export function formatNumber(value: number): string {
  return num.format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatKm(km: number): string {
  if (!km) return "Ubegrenset";
  return `${num.format(km)} km/år`;
}

const TILBUDSTYPE_LABEL: Record<string, string> = {
  leasing: "Leasing",
  lån: "Billån",
  leie: "Bilabonnement",
};

export function tilbudstypeLabel(t: string): string {
  return TILBUDSTYPE_LABEL[t] ?? t;
}

const SEGMENT_LABEL: Record<string, string> = {
  småbil: "Småbil",
  kompakt: "Kompakt",
  suv: "SUV",
  stasjonsvogn: "Stasjonsvogn",
  premium: "Premium",
};

export function segmentLabel(s: string): string {
  return SEGMENT_LABEL[s] ?? s;
}

const DRIVLINJE_LABEL: Record<string, string> = {
  elbil: "Elbil",
  hybrid: "Hybrid",
  bensin: "Bensin",
  diesel: "Diesel",
};

export function drivlinjeLabel(d: string): string {
  return DRIVLINJE_LABEL[d] ?? d;
}

/** Estimert lesetid i minutter basert på ~200 ord/min. */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
