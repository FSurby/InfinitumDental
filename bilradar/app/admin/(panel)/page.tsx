import Link from "next/link";
import { getStatsSummary, getAllPostsAdmin } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Admin – oversikt" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

export default async function AdminDashboard() {
  const [summary, posts] = await Promise.all([
    getStatsSummary(),
    getAllPostsAdmin(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Oversikt</h1>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Aktive tilbud" value={summary.aktiveTilbud} />
        <StatCard label="Tilbud totalt" value={summary.totaltTilbud} />
        <StatCard
          label="Publiserte artikler"
          value={summary.publiserteArtikler}
        />
        <StatCard label="Merker" value={summary.merker} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Snarveier</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/tilbud/ny" className="btn-accent">
              + Nytt tilbud
            </Link>
            <Link href="/admin/blogg/ny" className="btn-ghost">
              + Ny artikkel
            </Link>
            <Link href="/admin/statistikk" className="btn-ghost">
              Oppdater statistikk
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold">Siste artikler</h2>
          <ul className="divide-y divide-[rgb(var(--border))]">
            {posts.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <Link
                  href={`/admin/blogg/${p.id}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {p.tittel}
                </Link>
                <span className="shrink-0 text-xs text-muted">
                  {p.publisert ? formatDate(p.opprettet) : "Utkast"}
                </span>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="py-2.5 text-sm text-muted">Ingen artikler.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
