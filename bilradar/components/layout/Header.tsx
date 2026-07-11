import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/config";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-app bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-fg"
          >
            {/* Radar-glyf */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12 4.5 6.5" />
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent-soft hover:text-[rgb(var(--text))]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/tilbud" className="btn-accent hidden sm:inline-flex">
            Finn tilbud
          </Link>
        </div>
      </div>
    </header>
  );
}
