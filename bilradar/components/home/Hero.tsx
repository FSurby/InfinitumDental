import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

const quickLinks = [
  { label: "Elbil", href: "/tilbud?drivlinje=elbil" },
  { label: "SUV", href: "/tilbud?segment=suv" },
  { label: "Under 3 000/mnd", href: "/tilbud?maxPris=3000" },
  { label: "Leasing", href: "/tilbud?tilbudstype=leasing" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
      />
      <div className="container-page relative py-14 sm:py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="chip mb-5 border-transparent bg-accent-soft text-[rgb(var(--text))]">
            <span aria-hidden>⚡</span> Oppdaterte tilbud hver uke
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Finn de beste{" "}
            <span className="text-accent">biltilbudene</span> i Norge
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            {SITE_NAME} samler leasing, billån og bilabonnement på ett sted.
            Filtrer på merke, drivlinje og pris – og del søket ditt med én
            lenke.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/tilbud" className="btn-accent px-7 text-base">
              Se alle tilbud
            </Link>
            <Link href="/merker" className="btn-ghost px-6 text-base">
              Mest solgte biler
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="self-center text-sm text-muted">Populært:</span>
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="chip transition-colors hover:bg-accent-soft"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
