"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/supabase/auth";
import type { ActionResult } from "@/lib/types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function guard() {
  const { configured, user, isAdmin } = await getAuthState();
  if (!configured)
    return { error: "Supabase er ikke konfigurert. Legg inn nøkler i .env.local." };
  if (!user) return { error: "Du må logge inn." };
  if (!isAdmin) return { error: "Kontoen din har ikke admin-tilgang." };
  return { error: null };
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function int(fd: FormData, key: string): number {
  return Math.round(Number(fd.get(key) ?? 0)) || 0;
}

// ---------------- Tilbud ----------------

export async function saveOffer(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  const g = await guard();
  if (g.error) return { ok: false, error: g.error };

  const supabase = createClient();
  const id = str(fd, "id");
  const modell = str(fd, "modell");
  if (!modell) return { ok: false, error: "Modell er påkrevd." };

  // Bildeopplasting til Storage (valgfritt).
  const uploaded: string[] = [];
  const files = fd.getAll("bilder") as File[];
  for (const file of files) {
    if (file && file.size > 0) {
      const path = `${slugify(modell)}-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("offers")
        .upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("offers").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
  }
  const urlLines = str(fd, "bilde_urls")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const bilde_urls = [...urlLines, ...uploaded];

  const row = {
    brand_id: str(fd, "brand_id"),
    modell,
    slug: str(fd, "slug") || slugify(modell),
    segment: str(fd, "segment"),
    drivlinje: str(fd, "drivlinje"),
    tilbudstype: str(fd, "tilbudstype"),
    maanedspris: int(fd, "maanedspris"),
    startleie: int(fd, "startleie"),
    bindingstid_mnd: int(fd, "bindingstid_mnd"),
    km_per_aar: int(fd, "km_per_aar"),
    forhandler: str(fd, "forhandler"),
    forhandler_url: str(fd, "forhandler_url") || null,
    popularitet: int(fd, "popularitet"),
    aktiv: fd.get("aktiv") === "on",
    ...(bilde_urls.length ? { bilde_urls } : {}),
  };

  const { error } = id
    ? await supabase.from("offers").update(row).eq("id", id)
    : await supabase.from("offers").insert({ ...row, bilde_urls });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/tilbud");
  revalidatePath("/tilbud");
  redirect("/admin/tilbud");
}

export async function deleteOffer(fd: FormData): Promise<void> {
  const g = await guard();
  if (g.error) return;
  const supabase = createClient();
  await supabase.from("offers").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/tilbud");
  revalidatePath("/tilbud");
}

// ---------------- Blogg ----------------

export async function savePost(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  const g = await guard();
  if (g.error) return { ok: false, error: g.error };

  const supabase = createClient();
  const id = str(fd, "id");
  const tittel = str(fd, "tittel");
  if (!tittel) return { ok: false, error: "Tittel er påkrevd." };

  const row = {
    tittel,
    slug: str(fd, "slug") || slugify(tittel),
    utdrag: str(fd, "utdrag"),
    innhold: str(fd, "innhold"),
    cover_url: str(fd, "cover_url") || null,
    kategori: str(fd, "kategori") || "Nyheter",
    tags: str(fd, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    publisert: fd.get("publisert") === "on",
  };

  const { error } = id
    ? await supabase.from("posts").update(row).eq("id", id)
    : await supabase.from("posts").insert(row);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blogg");
  revalidatePath("/blogg");
  redirect("/admin/blogg");
}

export async function deletePost(fd: FormData): Promise<void> {
  const g = await guard();
  if (g.error) return;
  const supabase = createClient();
  await supabase.from("posts").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/blogg");
  revalidatePath("/blogg");
}

// ---------------- Salgsstatistikk ----------------

export async function saveSalesStat(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  const g = await guard();
  if (g.error) return { ok: false, error: g.error };

  const supabase = createClient();
  const brand_id = str(fd, "brand_id");
  const maaned = str(fd, "maaned"); // YYYY-MM-01
  if (!brand_id || !maaned)
    return { ok: false, error: "Merke og måned er påkrevd." };

  const row = {
    brand_id,
    maaned,
    modell: str(fd, "modell"),
    antall_registreringer: int(fd, "antall_registreringer"),
    plassering: int(fd, "plassering"),
  };

  const { error } = await supabase
    .from("sales_stats")
    .upsert(row, { onConflict: "brand_id,maaned" });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/statistikk");
  revalidatePath("/merker");
  return { ok: true };
}

// ---------------- Auth ----------------

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
