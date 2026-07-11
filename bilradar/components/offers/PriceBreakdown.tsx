import type { Offer } from "@/lib/types";
import { calcTotalCost } from "@/lib/utils/calc";
import { formatKr, tilbudstypeLabel } from "@/lib/utils/format";

export function PriceBreakdown({ offer }: { offer: Offer }) {
  const b = calcTotalCost(offer);
  const startLabel =
    offer.tilbudstype === "lån" ? "Egenkapital" : "Startleie";

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold">Priskalkyle</h2>
      <p className="mt-1 text-sm text-muted">
        Estimert totalkostnad over {b.antallMaaneder} måneder (
        {tilbudstypeLabel(offer.tilbudstype).toLowerCase()}).
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <Row label="Månedspris" value={`${formatKr(b.maanedskostnad)} × ${b.antallMaaneder}`} />
        <Row label="Sum månedlige" value={formatKr(b.sumMaaneder)} />
        <Row label={startLabel} value={formatKr(b.startleie)} />
        <div className="border-t border-app pt-3">
          <Row
            label="Totalt over perioden"
            value={formatKr(b.totalt)}
            strong
          />
          <Row
            label="Effektiv månedspris"
            value={`${formatKr(b.effektivManedspris)}/mnd`}
            muted
          />
        </div>
      </dl>

      {offer.forhandler_url && (
        <a
          href={offer.forhandler_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent mt-6 w-full"
        >
          Til forhandler
          <span aria-hidden>↗</span>
        </a>
      )}
      <p className="mt-3 text-center text-xs text-muted">
        Hos {offer.forhandler}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={muted ? "text-muted" : ""}>{label}</dt>
      <dd
        className={`tabular-nums ${
          strong ? "text-lg font-bold" : muted ? "text-muted" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
