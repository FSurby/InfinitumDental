"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { Post, ActionResult } from "@/lib/types";
import { savePost } from "@/app/admin/actions";

const initial: ActionResult = { ok: false };
const labelCls = "mb-1 block text-sm font-medium";
const inputCls =
  "w-full rounded-xl border border-app bg-[rgb(var(--bg))] px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-accent disabled:opacity-60"
    >
      {pending ? "Lagrer…" : "Lagre artikkel"}
    </button>
  );
}

export function PostForm({
  post,
  disabled,
}: {
  post?: Post;
  disabled?: boolean;
}) {
  const [state, formAction] = useFormState(savePost, initial);

  return (
    <form action={formAction} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="tittel" className={labelCls}>
          Tittel *
        </label>
        <input
          id="tittel"
          name="tittel"
          required
          defaultValue={post?.tittel}
          className={inputCls}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kategori" className={labelCls}>
            Kategori
          </label>
          <input
            id="kategori"
            name="kategori"
            defaultValue={post?.kategori ?? "Nyheter"}
            className={inputCls}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="tags" className={labelCls}>
            Tags (kommaseparert)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            className={inputCls}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label htmlFor="slug" className={labelCls}>
          Slug (valgfri)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          className={inputCls}
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="cover_url" className={labelCls}>
          Cover-bilde URL
        </label>
        <input
          id="cover_url"
          name="cover_url"
          type="url"
          defaultValue={post?.cover_url ?? ""}
          className={inputCls}
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="utdrag" className={labelCls}>
          Utdrag
        </label>
        <textarea
          id="utdrag"
          name="utdrag"
          rows={2}
          defaultValue={post?.utdrag}
          className={inputCls}
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="innhold" className={labelCls}>
          Innhold (markdown)
        </label>
        <textarea
          id="innhold"
          name="innhold"
          rows={14}
          defaultValue={post?.innhold}
          className={`${inputCls} font-mono`}
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-muted">
          Støtter ## overskrifter, **fet**, *kursiv*, lister (- / 1.), &gt;
          sitat og [lenker](https://…).
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="publisert"
          defaultChecked={post ? post.publisert : false}
          className="h-5 w-5 rounded accent-[rgb(var(--accent))]"
          disabled={disabled}
        />
        Publisert
      </label>

      {state.error && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton disabled={disabled} />
        <Link href="/admin/blogg" className="btn-ghost">
          Avbryt
        </Link>
      </div>
    </form>
  );
}
