import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "Admin – ny artikkel" };

export default function NyArtikkel() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Ny artikkel</h1>
      <PostForm disabled={!isSupabaseConfigured()} />
    </div>
  );
}
