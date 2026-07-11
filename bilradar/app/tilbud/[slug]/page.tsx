import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllOfferSlugs,
  getOfferBySlug,
  getSimilarOffers,
} from "@/lib/data/offers";
import { calcTotalCost } from "@/lib/utils/calc";
import {
  drivlinjeLabel,
  formatKm,
  formatKr,
  segmentLabel,
  tilbudstypeLabel,
} from "@/lib/utils/format";
import { Gallery } from "@/components/offers/Gallery";
import { PriceBreakdown } from "@/components/offers/PriceBreakdown";
import { OfferCard } from "@/components/offers/OfferCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export async function generateStaticParams() {
  const slugs = await getAllOfferSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const offer = await getOfferBySlug(params.slug);
  if (!offer) return { title: "Tilbud ikke funnet" };
  const navn = `${offer.brand?.navn ?? ""} ${offer.modell}`.trim();
  const title = `${navn} – ${formatKr(offer.maanedspris)}/mnd`;
  const description = `${tilbudstypeLabel(offer.tilbudstype)} av ${navn} fra ${formatKr(
    offer.maanedspris,
  )}/mnd hos ${offer.forhandler}. Se full priskalkyle på ${SITE_NAME}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: offer.bilde_urls?.[0] ? [offer.bilde_urls[0]] : undefined,
    },
  };
}

export default async function OfferPage({
  params,
}: {
  params: { slug: string };
}) {
  const offer = await getOfferBySlug(params.slug);
  if (!offer) notFound();

  const similar = await getSimilarOffers(offer, 3);
  const navn = `${offer.brand?.navn ?? ""} ${offer.modell}`.trim();
  const breakdown = calcTotalCost(offer);

  const specs: { label: string; value: string }[] = [
    { label: "Tilbudstype", value: tilbudstypeLabel(offer.tilbudstype) },
    { label: "Segment", value: segmentLabel(offer.segment) },
    { label: "Drivlinje", value: drivlinjeLabel(offer.drivlinje) },
    {
      label: "Bindingstid",
      value:
        offer.bindingstid_mnd > 0
          ? `${offer.bindingstid_mnd} måneder`
          : "Uten binding",
    },
    { label: "Kilometer", value: formatKm(offer.km_per_aar) },
    {
      label: offer.tilbudstype === "lån" ? "Egenkapital" : "Startleie",
      value: formatKr(offer.startleie),
    },
    { label: "Forhandler", value: offer.forhandler },
    { label: "Totalkostnad", value: formatKr(breakdown.totalt) },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: navn,
    brand: { "@type": "Brand", name: offer.brand?.navn },
    image: offer.bilde_urls,
    category: segmentLabel(offer.segment),
    offers: {
      "@type": "Offer",
      price: offer.maanedspris,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/tilbud/${offer.slug}`,
      seller: { "@type": "Organization", name: offer.forhandler },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: offer.maanedspris,
        priceCurrency: "NOK",
        unitText: "MND",
      },
    },
  };

  return (
    <div className="container-page py-6 sm:py-8">
      <JsonLd data={jsonLd} />

      <nav className="mb-5 text-sm text-muted" aria-label="Sti">
        <Link href="/tilbud" className="hover:text-[rgb(var(--text))]">
          ← Tilbake til tilbud
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Gallery images={offer.bilde_urls} alt={navn} />

          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
                {tilbudstypeLabel(offer.tilbudstype)}
              </span>
              <span>{offer.brand?.navn}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {offer.modell}
            </h1>
            <div className="mt-2 text-2xl font-bold">
              {formatKr(offer.maanedspris)}
              <span className="text-base font-medium text-muted">/mnd</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Spesifikasjoner</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between border-b border-app py-3"
                >
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="text-sm font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PriceBreakdown offer={offer} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Lignende tilbud
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
