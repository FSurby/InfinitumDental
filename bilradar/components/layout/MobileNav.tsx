"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Hjem", icon: HomeIcon },
  { href: "/tilbud", label: "Tilbud", icon: TagIcon },
  { href: "/merker", label: "Solgte", icon: ChartIcon },
  { href: "/blogg", label: "Blogg", icon: BookIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hovedmeny"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-app bg-[rgb(var(--surface))]/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  active ? "text-[rgb(var(--text))]" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-8 w-10 items-center justify-center rounded-full ${
                    active ? "bg-accent text-accent-fg" : ""
                  }`}
                >
                  <Icon />
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const svg = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function HomeIcon() {
  return (
    <svg {...svg}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg {...svg}>
      <path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a1 1 0 0 1 0 1.4Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg {...svg}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...svg}>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M18 3v18" />
    </svg>
  );
}
