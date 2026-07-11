import { notFound } from "next/navigation";
import { getBrands } from "@/lib/data/brands";
import { getOfferByIdAdmin } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { OfferForm } from "@/components/admin/OfferForm";

export const metadata = { title: "Admin – rediger tilbud" };

export default async function RedigerTilbud({
  params,
}: {
  params: { id: string };
}) {
  const [brands, offer] = await Promise.all([
    getBrands(),
    getOfferByIdAdmin(params.id),
  ]);
  if (!offer) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Rediger: {offer.modell}</h1>
      <OfferForm
        brands={brands}
        offer={offer}
        disabled={!isSupabaseConfigured()}
      />
    </div>
  );
}
