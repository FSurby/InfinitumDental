import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/types";
import {
  drivlinjeLabel,
  formatKm,
  formatKr,
  segmentLabel,
  tilbudstypeLabel,
} from "@/lib/utils/format";

export function OfferCard({ offer }: { offer: Offer }) {
  const brandNavn = offer.brand?.navn ?? "";
  const img = offer.bilde_urls?.[0];

  return (
    <Link
      href={`/tilbud/${offer.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[rgb(var(--border))]">
        {img ? (
          <Image
            src={img}
            alt={`${brandNavn} ${offer.modell}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
          {tilbudstypeLabel(offer.tilbudstype)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-[rgb(var(--text))]">
            {brandNavn}
          </span>
          <span aria-hidden>·</span>
          <span>{segmentLabel(offer.segment)}</span>
          <span aria-hidden>·</span>
          <span>{drivlinjeLabel(offer.drivlinje)}</span>
        </div>

        <h3 className="mt-1 text-lg font-semibold leading-tight">
          {offer.modell}
        </h3>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              {formatKr(offer.maanedspris)}
              <span className="text-sm font-medium text-muted">/mnd</span>
            </div>
            <div className="text-xs text-muted">
              {offer.startleie > 0
                ? `Startleie ${formatKr(offer.startleie)}`
                : "Ingen startleie"}
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-app pt-3 text-xs text-muted">
          <div>
            <dt className="sr-only">Bindingstid</dt>
            <dd>
              {offer.bindingstid_mnd > 0
                ? `${offer.bindingstid_mnd} mnd binding`
                : "Uten binding"}
            </dd>
          </div>
          <div className="text-right">
            <dt className="sr-only">Kilometer</dt>
            <dd>{formatKm(offer.km_per_aar)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
