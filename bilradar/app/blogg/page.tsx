import type { Metadata } from "next";
import { getPosts } from "@/lib/data/posts";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blogg – nyheter og kjøpsguider",
  description:
    "Siste nytt om det norske bilmarkedet, tester, sammenligninger og kjøpsguider for leasing, elbil og billån.",
};

export default async function BloggPage() {
  const posts = await getPosts();

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blogg</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Nyheter, tester og kjøpsguider for det norske bilmarkedet.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center text-muted">
          Ingen artikler publisert ennå.
        </div>
      )}
    </div>
  );
}
