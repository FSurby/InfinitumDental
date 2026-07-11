"use client";

import type { Brand } from "@/lib/types";
import { countActiveFilters } from "@/lib/utils/filters";
import { useOfferFilters } from "@/lib/hooks/useOfferFilters";
import { FilterForm } from "./FilterForm";

export function FilterSidebar({ brands }: { brands: Brand[] }) {
  const { filter, clearAll } = useOfferFilters();
  const active = countActiveFilters(filter);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Filtrer</h2>
          {active > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-muted underline-offset-2 hover:underline"
            >
              Nullstill
            </button>
          )}
        </div>
        <FilterForm brands={brands} />
      </div>
    </aside>
  );
}
