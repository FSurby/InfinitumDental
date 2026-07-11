import Link from "next/link";
import { getFeaturedOffers } from "@/lib/data/offers";
import { getTopSales } from "@/lib/data/sales";
import { getPosts } from "@/lib/data/posts";
import { Hero } from "@/components/home/Hero";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { BrandRanking } from "@/components/brands/BrandRanking";
import { PostCard } from "@/components/blog/PostCard";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [offers, sales, posts] = await Promise.all([
    getFeaturedOffers(6),
    getTopSales(5),
    getPosts(3),
  ]);

  return (
    <>
      <Hero />

      <section className="container-page py-12">
        <SectionHeader
          title="Populære tilbud nå"
          href="/tilbud"
          linkLabel="Alle tilbud"
        />
        <OfferGrid offers={offers} />
      </section>

      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader
              title="Mest solgte i Norge"
              href="/merker"
              linkLabel="Hele listen"
            />
            <BrandRanking stats={sales} compact />
          </div>
          <div className="card hidden bg-accent-soft p-8 lg:block">
            <h3 className="text-xl font-bold">Slik bruker du Bilradar</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-accent">1.</span> Filtrer på
                merke, drivlinje, segment og pris.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">2.</span> Sammenlign
                månedspris og totalkostnad over bindingstiden.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">3.</span> Gå videre til
                forhandleren når du finner riktig bil.
              </li>
            </ul>
            <Link href="/tilbud" className="btn-accent mt-6">
              Kom i gang
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeader
          title="Siste fra bloggen"
          href="/blogg"
          linkLabel="Alle artikler"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
