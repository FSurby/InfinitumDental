import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils/format";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blogg/${post.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[rgb(var(--border))]">
        {post.cover_url && (
          <Image
            src={post.cover_url}
            alt={post.tittel}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[rgb(var(--surface))]/90 px-3 py-1 text-xs font-semibold">
          {post.kategori}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">{post.tittel}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.utdrag}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <span>{formatDate(post.opprettet)}</span>
          <span aria-hidden>·</span>
          <span>{readingTime(post.innhold)} min lesing</span>
        </div>
      </div>
    </Link>
  );
}
