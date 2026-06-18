const BASE_URL = 'https://api.nb.no/catalog/v1';
const IIIF_BASE = 'https://www.nb.no/services/image/resolver';

export async function searchBooks({ query = 'barnebok', page = 0, size = 24 } = {}) {
  const params = new URLSearchParams({
    q: query || 'barnebok',
    size: String(size),
    page: String(page),
  });
  params.append('filter', 'mediatype:bøker');
  params.append('filter', 'contentClasses:public');

  const res = await fetch(`${BASE_URL}/items?${params}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API-feil: ${res.status}`);
  return res.json();
}

export async function getBook(id) {
  const res = await fetch(`${BASE_URL}/items/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API-feil: ${res.status}`);
  return res.json();
}

export async function getManifest(urn) {
  const res = await fetch(`${IIIF_BASE}/${encodeURIComponent(urn)}/manifest`, {
    headers: { Accept: 'application/ld+json, application/json' },
  });
  if (!res.ok) throw new Error(`Manifest-feil: ${res.status}`);
  return res.json();
}

export function getThumbnailUrl(urn) {
  return `${IIIF_BASE}/${encodeURIComponent(urn)}/thumbnail`;
}

export function getPageUrl(urn, pageNumber) {
  return `${IIIF_BASE}/${encodeURIComponent(urn)}/pages/${pageNumber}/thumb/large`;
}

export function getLargePageUrl(urn, pageNumber) {
  return `${IIIF_BASE}/${encodeURIComponent(urn)}/pages/${pageNumber}/full/!1200,1600/0/default.jpg`;
}

export function extractBookInfo(item) {
  if (!item) return null;
  const meta = item.metadata || {};
  const access = item.accessInfo || {};
  const links = item._links || {};
  const id = item.id || '';

  const description = Array.isArray(meta.description)
    ? meta.description.join(' ')
    : meta.description || '';

  return {
    id,
    title: meta.title || 'Ukjent tittel',
    authors: (meta.creators || []).map(c => c.name).filter(Boolean).join(', ') || 'Ukjent forfatter',
    year: meta.publicationYear || '',
    publisher: (meta.publishers || []).filter(Boolean).join(', ') || '',
    description,
    languages: meta.languages || [],
    subjects: meta.subjects || [],
    isPublic: access.accessAllowed === true,
    thumbnailSmall: links.thumbnail_small?.href || getThumbnailUrl(id),
    thumbnailLarge: links.thumbnail_large?.href || getThumbnailUrl(id),
    manifestUrl: links.presentation?.href || `${IIIF_BASE}/${encodeURIComponent(id)}/manifest`,
  };
}
