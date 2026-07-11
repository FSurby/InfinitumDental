import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deletePost } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Admin – blogg" };

export default async function AdminPosts() {
  const posts = await getAllPostsAdmin();
  const disabled = !isSupabaseConfigured();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artikler ({posts.length})</h1>
        <Link href="/admin/blogg/ny" className="btn-accent">
          + Ny artikkel
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-app text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Tittel</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Handling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--border))]">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.tittel}</div>
                  <div className="text-xs text-muted">
                    {formatDate(p.opprettet)}
                  </div>
                </td>
                <td className="px-4 py-3">{p.kategori}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.publisert
                        ? "bg-accent-soft text-[rgb(var(--text))]"
                        : "bg-[rgb(var(--border))] text-muted"
                    }`}
                  >
                    {p.publisert ? "Publisert" : "Utkast"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blogg/${p.id}`}
                      className="rounded-lg px-3 py-1.5 font-medium hover:bg-accent-soft"
                    >
                      Rediger
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={p.id} />
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
