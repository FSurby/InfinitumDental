import Link from "next/link";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-app">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="text-lg font-bold">{SITE_NAME}</div>
          <p className="mt-2 max-w-sm text-sm text-muted">{SITE_TAGLINE}.</p>
          <p className="mt-4 text-xs text-muted">
            Prisene er veiledende og hentet fra forhandlere. Bilradar er en
            uavhengig tjeneste og selger ikke biler selv.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Utforsk</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[rgb(var(--text))]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Om</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/blogg" className="hover:text-[rgb(var(--text))]">
                Nyheter og guider
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-[rgb(var(--text))]">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-app">
        <div className="container-page py-6 text-xs text-muted">
          © {new Date().getFullYear()} {SITE_NAME}. Alle priser i NOK inkl.
          mva.
        </div>
      </div>
    </footer>
  );
}
