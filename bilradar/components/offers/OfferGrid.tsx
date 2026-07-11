import type { Offer } from "@/lib/types";
import { OfferCard } from "./OfferCard";

export function OfferGrid({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-12 text-center">
        <span className="text-3xl" aria-hidden>
          🔍
        </span>
        <p className="text-lg font-semibold">Ingen tilbud matcher filtrene</p>
        <p className="text-sm text-muted">
          Prøv å fjerne noen filtre for å se flere biler.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((o) => (
        <OfferCard key={o.id} offer={o} />
      ))}
    </div>
  );
}
