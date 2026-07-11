import { renderMarkdown } from "@/lib/utils/markdown";

/**
 * Renderer artikkelinnhold (lettvekts-markdown) som trygg HTML.
 * Se lib/utils/markdown.ts for hvilke elementer som støttes.
 */
export function PostBody({ innhold }: { innhold: string }) {
  return (
    <div
      className="post-body space-y-4 text-[rgb(var(--text))]"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(innhold) }}
    />
  );
}
