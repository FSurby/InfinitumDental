// Alle data-endepunkter går gjennom Express-proxyen på /api
// Boksidebilder lastes direkte fra nb.no (img-tagger trenger ikke CORS-headere)

const IMAGES = 'https://www.nb.no/services/image/resolver';

// ─── Søk ──────────────────────────────────────────────────────────────────
export async function searchBooks({ q = 'barnebok', page = 0, size = 24 } = {}) {
  const params = new URLSearchParams({ q, page: String(page), size: String(size) });
  const res = await fetch(`/api/search?${params}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Enkeltbok ─────────────────────────────────────────────────────────────
export async function getBook(id) {
  const res = await fetch(`/api/book/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Tilemap (sidetall) ────────────────────────────────────────────────────
export async function getTilemap(urn) {
  const res = await fetch(`/api/tilemap?urn=${encodeURIComponent(urn)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Tilemap-responsen kan være et array eller et objekt med pages/tiles
export function parseTilemap(data) {
  const pages = Array.isArray(data)
    ? data
    : (data?.pages || data?.tiles || data?.page || []);
  return { totalPages: pages.length, pages };
}

// ─── Bilde-URLer (direkte, ingen proxy nødvendig for img-tagger) ───────────
export function getThumbnailUrl(urn) {
  return `${IMAGES}/${encodeURIComponent(urn)}/thumbnail`;
}

export function getPageThumbUrl(urn, pageNumber) {
  return `${IMAGES}/${encodeURIComponent(urn)}/pages/${pageNumber}/thumb/large`;
}

export function getPageFullUrl(urn, pageNumber) {
  return `${IMAGES}/${encodeURIComponent(urn)}/pages/${pageNumber}/full/!1200,1600/0/default.jpg`;
}

// ─── Metadata-parser ──────────────────────────────────────────────────────
export function extractBookInfo(item) {
  if (!item) return null;

  const meta = item.metadata || {};
  const access = item.accessInfo || {};
  const links = item._links || {};
  const id = item.id || item.sesamid || '';

  // År kan ligge i flere felt avhengig av API-versjon
  const originInfo = meta.originInfo || {};
  const year = meta.publicationYear
    || originInfo.publicationYear
    || originInfo.issued
    || '';

  const description = Array.isArray(meta.description)
    ? meta.description.join(' ')
    : (meta.description || '');

  // "EVERYWHERE" = fritt tilgjengelig; sjekk begge mønstrene
  const isPublic = access.accessAllowedFrom === 'EVERYWHERE'
    || access.accessAllowed === true
    || (access.contentClasses || []).includes('public');

  const authors = (meta.creators || [])
    .map(c => (typeof c === 'string' ? c : c.name))
    .filter(Boolean)
    .join(', ') || 'Ukjent forfatter';

  return {
    id,
    title: meta.title || 'Ukjent tittel',
    authors,
    year: String(year || ''),
    publisher: (meta.publishers || []).filter(Boolean).join(', ') || '',
    description,
    languages: meta.languages || [],
    subjects: meta.subjects || [],
    isPublic,
    thumbnailSmall: links.thumbnail_small?.href || getThumbnailUrl(id),
    thumbnailLarge: links.thumbnail_large?.href || getThumbnailUrl(id),
  };
}
