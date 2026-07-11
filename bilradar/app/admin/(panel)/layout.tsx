import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/supabase/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "../actions";
import { SITE_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";

function Shell({
  children,
  right,
  banner,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  banner?: React.ReactNode;
}) {
  return (
    <div className="container-page py-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-app pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold">
            {SITE_NAME}{" "}
            <span className="font-normal text-muted">/ admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <AdminNav />
          {right}
        </div>
      </div>
      {banner}
      {children}
    </div>
  );
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { configured, user, isAdmin } = await getAuthState();

  // Demo-modus: ingen Supabase. Vis panelet med seed-data (skrivebeskyttet).
  if (!configured) {
    return (
      <Shell
        banner={
          <div className="mb-6 rounded-2xl border border-accent bg-accent-soft p-4 text-sm">
            <strong>Demo-modus.</strong> Supabase er ikke konfigurert, så
            admin viser eksempeldata og lagring er deaktivert. Legg inn
            Supabase-nøkler i <code>.env.local</code> for full tilgang. Se{" "}
            <code>README.md</code>.
          </div>
        }
      >
        {children}
      </Shell>
    );
  }

  if (!user) redirect("/admin/login");

  if (!isAdmin) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Ingen tilgang</h1>
        <p className="mt-2 text-muted">
          Kontoen <strong>{user.email}</strong> har ikke admin-rettigheter.
        </p>
        <form action={signOut} className="mt-6">
          <button className="btn-ghost">Logg ut</button>
        </form>
      </div>
    );
  }

  return (
    <Shell
      right={
        <form action={signOut}>
          <button className="btn-ghost !min-h-0 h-10 text-sm">Logg ut</button>
        </form>
      }
    >
      {children}
    </Shell>
  );
}
