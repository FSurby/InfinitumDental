"use client";

import type { Brand } from "@/lib/types";
import {
  DRIVLINJER,
  PRICE_MAX,
  PRICE_MIN,
  SEGMENTS,
  TILBUDSTYPER,
  BINDING_OPTIONS,
} from "@/lib/utils/filters";
import {
  drivlinjeLabel,
  formatKr,
  segmentLabel,
  tilbudstypeLabel,
} from "@/lib/utils/format";
import { useOfferFilters } from "@/lib/hooks/useOfferFilters";

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-app accent-[rgb(var(--accent))]"
      />
      <span>{label}</span>
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-app py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export function FilterForm({ brands }: { brands: Brand[] }) {
  const { filter, toggleValue, setNumber } = useOfferFilters();
  const minPris = filter.minPris ?? PRICE_MIN;
  const maxPris = filter.maxPris ?? PRICE_MAX;

  return (
    <div>
      <Section title="Tilbudstype">
        {TILBUDSTYPER.map((t) => (
          <CheckRow
            key={t}
            label={tilbudstypeLabel(t)}
            checked={filter.tilbudstype?.includes(t) ?? false}
            onChange={() => toggleValue("tilbudstype", t)}
          />
        ))}
      </Section>

      <Section title="Merke">
        <div className="max-h-56 overflow-y-auto pr-1">
          {brands.map((b) => (
            <CheckRow
              key={b.slug}
              label={b.navn}
              checked={filter.merke?.includes(b.slug) ?? false}
              onChange={() => toggleValue("merke", b.slug)}
            />
          ))}
        </div>
      </Section>

      <Section title="Segment">
        {SEGMENTS.map((s) => (
          <CheckRow
            key={s}
            label={segmentLabel(s)}
            checked={filter.segment?.includes(s) ?? false}
            onChange={() => toggleValue("segment", s)}
          />
        ))}
      </Section>

      <Section title="Drivlinje">
        {DRIVLINJER.map((d) => (
          <CheckRow
            key={d}
            label={drivlinjeLabel(d)}
            checked={filter.drivlinje?.includes(d) ?? false}
            onChange={() => toggleValue("drivlinje", d)}
          />
        ))}
      </Section>

      <Section title="Månedspris">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{formatKr(minPris)}</span>
          <span>{formatKr(maxPris)}</span>
        </div>
        <div className="mt-2 space-y-3">
          <label className="block text-xs text-muted">
            Fra
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={100}
              value={minPris}
              onChange={(e) => {
                const v = Number(e.target.value);
                setNumber("minPris", v <= PRICE_MIN ? undefined : v);
              }}
              className="mt-1 w-full accent-[rgb(var(--accent))]"
            />
          </label>
          <label className="block text-xs text-muted">
            Til
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={100}
              value={maxPris}
              onChange={(e) => {
                const v = Number(e.target.value);
                setNumber("maxPris", v >= PRICE_MAX ? undefined : v);
              }}
              className="mt-1 w-full accent-[rgb(var(--accent))]"
            />
          </label>
        </div>
      </Section>

      <Section title="Maks bindingstid">
        <div className="flex flex-wrap gap-2">
          {BINDING_OPTIONS.map((m) => {
            const active = filter.maxBinding === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() =>
                  setNumber("maxBinding", active ? undefined : m)
                }
                className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-transparent bg-accent text-accent-fg"
                    : "border-app hover:bg-accent-soft"
                }`}
              >
                {m} mnd
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
