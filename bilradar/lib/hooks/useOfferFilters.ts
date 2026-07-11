"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  Drivlinje,
  OfferFilter,
  Segment,
  SortKey,
  Tilbudstype,
} from "@/lib/types";

function readList(sp: URLSearchParams, key: string): string[] {
  const v = sp.get(key);
  return v ? v.split(",").filter(Boolean) : [];
}

/**
 * Leser gjeldende filter fra URL og gir setters som oppdaterer URL
 * (searchParams) slik at filtrerte visninger kan deles som lenke.
 */
export function useOfferFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filter: OfferFilter = {
    merke: readList(sp, "merke"),
    segment: readList(sp, "segment") as Segment[],
    drivlinje: readList(sp, "drivlinje") as Drivlinje[],
    tilbudstype: readList(sp, "tilbudstype") as Tilbudstype[],
    minPris: sp.get("minPris") ? Number(sp.get("minPris")) : undefined,
    maxPris: sp.get("maxPris") ? Number(sp.get("maxPris")) : undefined,
    maxBinding: sp.get("maxBinding") ? Number(sp.get("maxBinding")) : undefined,
    sort: (sp.get("sort") as SortKey) || "pris",
  };

  const commit = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, {
          scroll: false,
        });
      });
    },
    [router, pathname],
  );

  const toggleValue = useCallback(
    (key: keyof OfferFilter, value: string) => {
      const next = new URLSearchParams(sp.toString());
      const current = readList(next, key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      commit(next);
    },
    [sp, commit],
  );

  const setNumber = useCallback(
    (key: "minPris" | "maxPris" | "maxBinding", value: number | undefined) => {
      const next = new URLSearchParams(sp.toString());
      if (value == null) next.delete(key);
      else next.set(key, String(value));
      commit(next);
    },
    [sp, commit],
  );

  const setSort = useCallback(
    (value: SortKey) => {
      const next = new URLSearchParams(sp.toString());
      if (value === "pris") next.delete("sort");
      else next.set("sort", value);
      commit(next);
    },
    [sp, commit],
  );

  const removeChip = useCallback(
    (key: keyof OfferFilter, value?: string) => {
      const next = new URLSearchParams(sp.toString());
      if (value == null) {
        next.delete(key);
      } else {
        const updated = readList(next, key).filter((v) => v !== value);
        if (updated.length) next.set(key, updated.join(","));
        else next.delete(key);
      }
      commit(next);
    },
    [sp, commit],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    const sort = sp.get("sort");
    if (sort) next.set("sort", sort);
    commit(next);
  }, [sp, commit]);

  return {
    filter,
    isPending,
    toggleValue,
    setNumber,
    setSort,
    removeChip,
    clearAll,
  };
}
