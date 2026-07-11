import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "Admin – rediger artikkel" };

export default async function RedigerArtikkel({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostByIdAdmin(params.id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Rediger: {post.tittel}</h1>
      <PostForm post={post} disabled={!isSupabaseConfigured()} />
    </div>
  );
}
