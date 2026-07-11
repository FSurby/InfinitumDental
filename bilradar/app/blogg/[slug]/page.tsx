import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/data/posts";
import { formatDate, readingTime } from "@/lib/utils/format";
import { PostBody } from "@/components/blog/PostBody";
import { PostCard } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Artikkel ikke funnet" };
  return {
    title: post.tittel,
    description: post.utdrag,
    openGraph: {
      type: "article",
      title: post.tittel,
      description: post.utdrag,
      images: post.cover_url ? [post.cover_url] : undefined,
      publishedTime: post.opprettet,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.tittel,
    description: post.utdrag,
    image: post.cover_url ? [post.cover_url] : undefined,
    datePublished: post.opprettet,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blogg/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <div className="container-page py-6 sm:py-8">
      <JsonLd data={jsonLd} />

      <article className="mx-auto max-w-3xl">
        <nav className="mb-5 text-sm text-muted">
          <Link href="/blogg" className="hover:text-[rgb(var(--text))]">
            ← Tilbake til bloggen
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[rgb(var(--text))]">
            {post.kategori}
          </span>
          <span>{formatDate(post.opprettet)}</span>
          <span aria-hidden>·</span>
          <span>{readingTime(post.innhold)} min lesing</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.tittel}
        </h1>
        <p className="mt-3 text-lg text-muted">{post.utdrag}</p>

        {post.cover_url && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[rgb(var(--border))]">
            <Image
              src={post.cover_url}
              alt={post.tittel}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <PostBody innhold={post.innhold} />
        </div>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Relaterte artikler
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
