import { getBrands } from "@/lib/data/brands";
import { getTopSales } from "@/lib/data/sales";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { StatForm } from "@/components/admin/StatForm";
import { formatNumber } from "@/lib/utils/format";

export const metadata = { title: "Admin – salgsstatistikk" };

function currentMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export default async function AdminStats() {
  const [brands, stats] = await Promise.all([getBrands(), getTopSales(10)]);
  const disabled = !isSupabaseConfigured();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Salgsstatistikk</h1>
        <p className="mb-5 text-sm text-muted">
          Legg inn eller oppdater månedlige registreringstall (kilde: OFV).
          Eksisterende rad for samme merke og måned overskrives.
        </p>
        <StatForm
          brands={brands}
          defaultMonth={currentMonthStart()}
          disabled={disabled}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Nåværende topp 10</h2>
        <ol className="space-y-2">
          {stats.map((s) => (
            <li
              key={s.id}
              className="card flex items-center justify-between p-3 text-sm"
            >
              <span>
                <span className="mr-2 font-bold text-muted">
                  {s.plassering}.
                </span>
                {s.brand?.navn}{" "}
                <span className="text-muted">— {s.modell}</span>
              </span>
              <span className="font-medium tabular-nums">
                {formatNumber(s.antall_registreringer)}
              </span>
            </li>
          ))}
          {stats.length === 0 && (
            <li className="text-sm text-muted">Ingen data ennå.</li>
          )}
        </ol>
      </div>
    </div>
  );
}
