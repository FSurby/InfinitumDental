import Image from "next/image";
import type { SalesStat } from "@/lib/types";
import { formatNumber } from "@/lib/utils/format";

function Change({ stat }: { stat: SalesStat }) {
  const prev = stat.forrige_registreringer;
  if (prev == null) return null;
  const diff = stat.antall_registreringer - prev;
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : 0;

  if (diff === 0) {
    return <span className="text-xs font-medium text-muted">→ 0 %</span>;
  }
  const up = diff > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
      }`}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {up ? "+" : ""}
      {pct} %<span className="sr-only">endring fra forrige måned</span>
    </span>
  );
}

export function BrandRanking({
  stats,
  compact = false,
}: {
  stats: SalesStat[];
  compact?: boolean;
}) {
  const max = Math.max(...stats.map((s) => s.antall_registreringer), 1);

  return (
    <ol className="space-y-3">
      {stats.map((s) => {
        const width = Math.round((s.antall_registreringer / max) * 100);
        return (
          <li
            key={s.id}
            className="card flex items-center gap-4 p-3 sm:p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-[rgb(var(--text))]">
              {s.plassering}
            </span>

            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-1">
              {s.brand?.logo_url && (
                <Image
                  src={s.brand.logo_url}
                  alt={s.brand.navn}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="truncate font-semibold">{s.brand?.navn}</div>
                <Change stat={s} />
              </div>
              {!compact && (
                <div className="truncate text-xs text-muted">{s.modell}</div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
                  {formatNumber(s.antall_registreringer)}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
