import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "@/components/admin/LoginForm";
import { SITE_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Logg inn", robots: { index: false } };

export default async function LoginPage() {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { user, isAdmin } = await getAuthState();
    if (user && isAdmin) redirect("/admin");
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 block text-center text-xl font-bold">
          {SITE_NAME}
        </Link>
        <div className="card p-6">
          <h1 className="text-xl font-bold">Admin-innlogging</h1>
          <p className="mt-1 text-sm text-muted">
            Logg inn med admin-kontoen din.
          </p>

          {configured ? (
            <LoginForm />
          ) : (
            <div className="mt-5 rounded-2xl border border-accent bg-accent-soft p-4 text-sm">
              Supabase er ikke konfigurert. Innlogging er utilgjengelig i
              demo-modus. Du kan likevel åpne{" "}
              <Link href="/admin" className="font-semibold underline">
                admin-panelet
              </Link>{" "}
              for å se grensesnittet med eksempeldata.
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/" className="hover:underline">
            ← Tilbake til {SITE_NAME}
          </Link>
        </p>
      </div>
    </div>
  );
}
