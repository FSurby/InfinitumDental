"use client";

import { useEffect, useState } from "react";
import type { Brand } from "@/lib/types";
import { countActiveFilters } from "@/lib/utils/filters";
import { useOfferFilters } from "@/lib/hooks/useOfferFilters";
import { FilterForm } from "./FilterForm";

/** Mobil filter: knapp som åpner bottom sheet. Vises kun < lg. */
export function FilterSheet({ brands }: { brands: Brand[] }) {
  const [open, setOpen] = useState(false);
  const { filter, clearAll } = useOfferFilters();
  const active = countActiveFilters(filter);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filtrer
        {active > 0 && (
          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-fg">
            {active}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtrer tilbud"
          className="fixed inset-0 z-50 flex flex-col justify-end"
        >
          <button
            aria-label="Lukk"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[85dvh] animate-fade-in overflow-hidden rounded-t-3xl bg-[rgb(var(--surface))] shadow-soft-lg">
            <div className="flex items-center justify-between border-b border-app px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Filtrer</h2>
                {active > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-muted underline-offset-2 hover:underline"
                  >
                    Nullstill
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Lukk"
                className="btn-ghost !min-h-0 h-10 w-10 !px-0"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60dvh] overflow-y-auto px-5 py-2">
              <FilterForm brands={brands} />
            </div>
            <div className="border-t border-app p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-accent w-full"
              >
                Vis resultater
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
