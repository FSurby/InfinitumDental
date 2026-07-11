import type { Offer } from "@/lib/types";

export interface PriceBreakdown {
  startleie: number;
  maanedskostnad: number;
  antallMaaneder: number;
  sumMaaneder: number;
  totalt: number;
  effektivManedspris: number;
}

/**
 * Beregner total kostnad over bindingstiden.
 * total = startleie/egenkapital + månedspris × bindingstid.
 */
export function calcTotalCost(offer: Offer): PriceBreakdown {
  const antallMaaneder = offer.bindingstid_mnd || 0;
  const sumMaaneder = offer.maanedspris * antallMaaneder;
  const totalt = offer.startleie + sumMaaneder;
  const effektivManedspris =
    antallMaaneder > 0 ? Math.round(totalt / antallMaaneder) : offer.maanedspris;

  return {
    startleie: offer.startleie,
    maanedskostnad: offer.maanedspris,
    antallMaaneder,
    sumMaaneder,
    totalt,
    effektivManedspris,
  };
}
