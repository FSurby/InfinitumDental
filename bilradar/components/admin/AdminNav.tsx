"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Oversikt", exact: true },
  { href: "/admin/tilbud", label: "Tilbud" },
  { href: "/admin/blogg", label: "Blogg" },
  { href: "/admin/statistikk", label: "Salgsstatistikk" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto no-scrollbar">
      {links.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent text-accent-fg"
                : "text-muted hover:bg-accent-soft"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
