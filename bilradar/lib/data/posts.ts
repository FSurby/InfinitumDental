import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { posts as seedPosts } from "@/lib/seed/data";
import type { Post } from "@/lib/types";

const byNewest = (a: Post, b: Post) =>
  new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();

export async function getPosts(limit?: number): Promise<Post[]> {
  let posts: Post[];
  if (!isSupabaseConfigured()) {
    posts = seedPosts.filter((p) => p.publisert).sort(byNewest);
  } else {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("publisert", true)
      .order("opprettet", { ascending: false });
    if (error) {
      console.error("getPosts:", error.message);
      posts = [];
    } else {
      posts = (data as Post[]) ?? [];
    }
  }
  return limit ? posts.slice(0, limit) : posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    const p = seedPosts.find((x) => x.slug === slug && x.publisert);
    return p ?? null;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("publisert", true)
    .maybeSingle();
  if (error) {
    console.error("getPostBySlug:", error.message);
    return null;
  }
  return (data as Post) ?? null;
}

export async function getRelatedPosts(
  post: Post,
  limit = 2,
): Promise<Post[]> {
  const all = await getPosts();
  return all
    .filter((p) => p.id !== post.id)
    .sort((a, b) => {
      const overlap = (p: Post) =>
        p.tags.filter((t) => post.tags.includes(t)).length +
        (p.kategori === post.kategori ? 1 : 0);
      return overlap(b) - overlap(a);
    })
    .slice(0, limit);
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return seedPosts.filter((p) => p.publisert).map((p) => p.slug);
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("publisert", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
