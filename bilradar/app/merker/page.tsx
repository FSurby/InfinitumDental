import type { Metadata } from "next";
import { getTopSales } from "@/lib/data/sales";
import { BrandRanking } from "@/components/brands/BrandRanking";
import { salesMonthLabel } from "@/lib/seed/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Mest solgte biler i Norge",
  description:
    "Topp 10 mest registrerte bilmerker og modeller i Norge, med endring fra forrige måned. Basert på registreringsstatistikk (OFV).",
};

export default async function MerkerPage() {
  const stats = await getTopSales(10);
  const periode = isSupabaseConfigured() ? "" : salesMonthLabel;

  return (
    <div className="container-page py-8">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Mest solgte biler i Norge
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Rangering etter antall nyregistreringer{periode ? ` – ${periode}` : ""}.
            Pilene viser endring fra forrige måned. Kilde: registrerings­­statistikk
            (OFV).
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        {stats.length > 0 ? (
          <BrandRanking stats={stats} />
        ) : (
          <div className="card p-10 text-center text-muted">
            Ingen statistikk registrert ennå.
          </div>
        )}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted">
        Tallene oppdateres månedlig via admin-panelet.
      </p>
    </div>
  );
}
