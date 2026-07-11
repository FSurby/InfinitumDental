import { getBrands } from "@/lib/data/brands";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { OfferForm } from "@/components/admin/OfferForm";

export const metadata = { title: "Admin – nytt tilbud" };

export default async function NyttTilbud() {
  const brands = await getBrands();
  return (
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Nytt tilbud</h1>
      <OfferForm brands={brands} disabled={!isSupabaseConfigured()} />
    </div>
  );
}
