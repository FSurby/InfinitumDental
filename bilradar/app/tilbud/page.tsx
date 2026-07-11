import { Suspense } from "react";
import type { Metadata } from "next";
import { getOffers } from "@/lib/data/offers";
import { getBrands } from "@/lib/data/brands";
import { parseFilters } from "@/lib/utils/filters";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { OfferGridSkeleton } from "@/components/offers/OfferSkeleton";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { FilterSheet } from "@/components/filters/FilterSheet";
import { ActiveChips } from "@/components/filters/ActiveChips";
import { SortSelect } from "@/components/filters/SortSelect";

export const metadata: Metadata = {
  title: "Alle biltilbud",
  description:
    "Bla gjennom og filtrer alle leasing-, billån- og abonnementstilbud. Sorter på pris, nyeste eller mest populære.",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const filter = parseFilters(searchParams);
  const offers = await getOffers(filter);
  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        {offers.length} {offers.length === 1 ? "tilbud" : "tilbud"} funnet
      </p>
      <OfferGrid offers={offers} />
    </div>
  );
}

export default async function TilbudPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const brands = await getBrands();
  const key = JSON.stringify(searchParams);

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Biltilbud
        </h1>
        <p className="mt-2 text-muted">
          Finn ditt neste kjøretøy blant Norges beste tilbud.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Suspense>
          <FilterSidebar brands={brands} />
        </Suspense>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Suspense>
              <FilterSheet brands={brands} />
            </Suspense>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>

          <div className="mb-5">
            <Suspense>
              <ActiveChips brands={brands} />
            </Suspense>
          </div>

          <Suspense key={key} fallback={<OfferGridSkeleton />}>
            <Results searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
