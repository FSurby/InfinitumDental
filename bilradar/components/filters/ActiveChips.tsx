"use client";

import type { Brand, OfferFilter } from "@/lib/types";
import { useOfferFilters } from "@/lib/hooks/useOfferFilters";
import {
  drivlinjeLabel,
  formatKr,
  segmentLabel,
  tilbudstypeLabel,
} from "@/lib/utils/format";
import { countActiveFilters } from "@/lib/utils/filters";

interface ChipDef {
  key: keyof OfferFilter;
  value?: string;
  label: string;
}

export function ActiveChips({ brands }: { brands: Brand[] }) {
  const { filter, removeChip, clearAll } = useOfferFilters();
  const brandNavn = (slug: string) =>
    brands.find((b) => b.slug === slug)?.navn ?? slug;

  const chips: ChipDef[] = [];
  filter.tilbudstype?.forEach((v) =>
    chips.push({ key: "tilbudstype", value: v, label: tilbudstypeLabel(v) }),
  );
  filter.merke?.forEach((v) =>
    chips.push({ key: "merke", value: v, label: brandNavn(v) }),
  );
  filter.segment?.forEach((v) =>
    chips.push({ key: "segment", value: v, label: segmentLabel(v) }),
  );
  filter.drivlinje?.forEach((v) =>
    chips.push({ key: "drivlinje", value: v, label: drivlinjeLabel(v) }),
  );
  if (filter.minPris != null)
    chips.push({ key: "minPris", label: `Fra ${formatKr(filter.minPris)}` });
  if (filter.maxPris != null)
    chips.push({ key: "maxPris", label: `Til ${formatKr(filter.maxPris)}` });
  if (filter.maxBinding != null)
    chips.push({
      key: "maxBinding",
      label: `Maks ${filter.maxBinding} mnd`,
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c, i) => (
        <button
          key={`${c.key}-${c.value ?? i}`}
          type="button"
          onClick={() => removeChip(c.key, c.value)}
          className="chip transition-colors hover:bg-accent-soft"
        >
          {c.label}
          <span aria-hidden className="text-muted">
            ✕
          </span>
          <span className="sr-only">Fjern filter</span>
        </button>
      ))}
      {countActiveFilters(filter) > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-muted underline-offset-2 hover:underline"
        >
          Nullstill alle
        </button>
      )}
    </div>
  );
}
