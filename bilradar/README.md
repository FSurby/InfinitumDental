# Bilradar 🚗

Moderne, mobil-først nettside for det norske markedet som samler de beste
biltilbudene – **leasing, billån og bilabonnement** – med blogg, «mest solgte
merker»-oversikt og et beskyttet admin-panel.

> «Bilradar» er et placeholder-navn. Bytt `SITE_NAME` i `lib/config.ts` for å
> endre merkenavnet overalt.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** – Server Components som standard
- **Tailwind CSS** – dark mode via `class`, lime aksentfarge via CSS-variabler
- **Supabase** (Postgres + Auth + Storage) via `@supabase/ssr`
- Klar for deploy på **Vercel**

## Demo-modus vs. Supabase

Appen har et **datalag med fallback** (`lib/data/*`):

- **Uten Supabase-nøkler:** kjører på lokale seed-data (`lib/seed/data.ts`).
  Hele nettsiden ser komplett ut med én gang – perfekt for å utforske og
  utvikle uten database. Admin-panelet vises i skrivebeskyttet «demo-modus».
- **Med Supabase-nøkler:** all data hentes fra databasen, og admin-panelet får
  full CRUD + bildeopplasting.

Placeholder-bildene ligger lokalt i `public/` (SVG), så siden har ingen
eksterne bildeavhengigheter. Regenerer dem med `node scripts/gen-assets.mjs`.

## Kom i gang

```bash
cd bilradar
npm install
npm run dev
# → http://localhost:3000  (kjører på seed-data)
```

## Koble til Supabase (produksjon)

1. Opprett et prosjekt på [supabase.com](https://supabase.com).
2. Kopier miljøvariabler:
   ```bash
   cp .env.example .env.local
   ```
   Fyll inn fra Supabase → Project Settings → API:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=https://din-side.no
   ADMIN_EMAILS=deg@eksempel.no      # gir denne e-posten admin-tilgang
   ```
3. Kjør migrasjon og seed i Supabase SQL-editor (eller `supabase db push`):
   - `supabase/migrations/0001_init.sql` – tabeller, RLS, indekser, Storage-bucket
   - `supabase/seed.sql` – 15 tilbud, 3 artikler, merker og salgsstatistikk
4. **Opprett en admin-bruker:** Supabase → Authentication → Add user (med
   passord). Logg deretter inn på `/admin/login`. Kontoen blir admin fordi
   e-posten står i `ADMIN_EMAILS` (eller sett `profiles.is_admin = true`).
5. Start på nytt: `npm run dev`.

## Ruter

| Rute | Beskrivelse |
| --- | --- |
| `/` | Forside: hero, populære tilbud, mest solgte-teaser, siste blogg |
| `/tilbud` | Full tilbudsoversikt med filtre (URL-synket, delbar) |
| `/tilbud/[slug]` | Tilbudsdetalj: galleri, priskalkyle, lignende tilbud |
| `/merker` | Topp 10 mest solgte merker med endring vs. forrige måned |
| `/blogg`, `/blogg/[slug]` | Blogg med kategorier, tags, lesetid, relaterte |
| `/admin` | Beskyttet admin: dashboard, CRUD tilbud/blogg, statistikk |

## Admin-panel

- **Dashboard:** antall aktive tilbud, artikler m.m.
- **Tilbud:** opprett/rediger/slett, med bildeopplasting til Supabase Storage
  (bucket `offers`) eller bilde-URLer.
- **Blogg:** rik markdown-editor (## overskrifter, **fet**, lister, sitat, lenker).
- **Salgsstatistikk:** legg inn/oppdater månedlige registreringstall (OFV).

## Design

- Mobil-først (375 → 768 → 1280px), min. 44px trykkflater, sticky bunnmeny på
  mobil, filter som bottom sheet på mobil / sidebar på desktop.
- Dark mode med `ThemeToggle` (lagres i `localStorage`, ingen flash).
- Aksentfarge byttes ved å endre `--accent`-variablene i `app/globals.css`.

## SEO

- Per-side `metadata` + OpenGraph, `sitemap.xml`, `robots.txt`.
- Strukturerte data (JSON-LD): `Product`/`Offer` på tilbud, `Article` på blogg.

## Deploy på Vercel

1. Push repoet til GitHub.
2. Importer i Vercel, sett **Root Directory** til `bilradar`.
3. Legg inn samme miljøvariabler som i `.env.local`.
4. Deploy.

## Prosjektstruktur

```
app/           # ruter (App Router)
components/     # UI-komponenter (layout, offers, filters, blog, brands, admin)
lib/
  config.ts    # SITE_NAME m.m.
  types.ts     # domenetyper
  seed/        # lokale seed-data (demo-fallback)
  data/         # datalag: Supabase ELLER seed
  supabase/    # klienter + auth-hjelpere
  utils/       # format, filtre, priskalkyle, markdown
supabase/       # SQL-migrasjon + seed
public/        # lokale SVG-placeholdere (cars, brands, blog)
scripts/       # gen-assets.mjs
```
