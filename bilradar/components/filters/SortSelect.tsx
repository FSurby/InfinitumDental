"use client";

import type { SortKey } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/utils/filters";
import { useOfferFilters } from "@/lib/hooks/useOfferFilters";

export function SortSelect() {
  const { filter, setSort } = useOfferFilters();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sorter:</span>
      <select
        value={filter.sort ?? "pris"}
        onChange={(e) => setSort(e.target.value as SortKey)}
        className="min-h-[44px] rounded-full border border-app bg-[rgb(var(--surface))] px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
