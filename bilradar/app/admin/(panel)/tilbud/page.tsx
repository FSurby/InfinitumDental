import Link from "next/link";
import { getAllOffersAdmin } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deleteOffer } from "@/app/admin/actions";
import { formatKr, tilbudstypeLabel } from "@/lib/utils/format";

export const metadata = { title: "Admin – tilbud" };

export default async function AdminOffers() {
  const offers = await getAllOffersAdmin();
  const disabled = !isSupabaseConfigured();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tilbud ({offers.length})</h1>
        <Link href="/admin/tilbud/ny" className="btn-accent">
          + Nytt tilbud
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-app text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Modell</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Pris/mnd</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Handling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--border))]">
            {offers.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.modell}</div>
                  <div className="text-xs text-muted">{o.brand?.navn}</div>
                </td>
                <td className="px-4 py-3">{tilbudstypeLabel(o.tilbudstype)}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatKr(o.maanedspris)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      o.aktiv
                        ? "bg-accent-soft text-[rgb(var(--text))]"
                        : "bg-[rgb(var(--border))] text-muted"
                    }`}
                  >
                    {o.aktiv ? "Aktiv" : "Skjult"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/tilbud/${o.id}`}
                      className="rounded-lg px-3 py-1.5 font-medium hover:bg-accent-soft"
                    >
                      Rediger
                    </Link>
                    <form action={deleteOffer}>
                      <input type="hidden" name="id" value={o.id} />
                      <button
                        type="submit"
                        disabled={disabled}
                        className="rounded-lg px-3 py-1.5 font-medium text-rose-600 hover:bg-rose-500/10 disabled:opacity-40 dark:text-rose-400"
                      >
                        Slett
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
