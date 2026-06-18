import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const NB_API = 'https://api.nb.no/catalog/v1';
const NB_SERVICES = 'https://www.nb.no/services';

app.use(cors());
app.use(express.json());

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'Bokheimen/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fra ${url}`);
  return res.json();
}

// ─── Søk ──────────────────────────────────────────────────────────────────
// GET /api/search?q=barnebok&page=0&size=24
app.get('/api/search', async (req, res) => {
  try {
    const { q = 'barnebok', page = '0', size = '24' } = req.query;

    const params = new URLSearchParams({ q, size, page });
    params.append('filter', 'mediatype:bøker');
    params.append('filter', 'digital:Ja');
    params.append('filter', 'contentClasses:public');

    const data = await fetchJson(`${NB_API}/items?${params}`);
    res.json(data);
  } catch (err) {
    console.error('[search]', err.message);
    res.status(502).json({ error: `Søkefeil: ${err.message}` });
  }
});

// ─── Enkeltbok ─────────────────────────────────────────────────────────────
// GET /api/book/:id
app.get('/api/book/:id', async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const data = await fetchJson(`${NB_API}/items/${encodeURIComponent(id)}`);
    res.json(data);
  } catch (err) {
    console.error('[book]', err.message);
    res.status(502).json({ error: `Bokfeil: ${err.message}` });
  }
});

// ─── Tilemap (sidetall + bildeinfo) ────────────────────────────────────────
// GET /api/tilemap?urn=URN:NBN:no-nb_digibok_...
app.get('/api/tilemap', async (req, res) => {
  try {
    const { urn } = req.query;
    if (!urn) return res.status(400).json({ error: 'URN mangler' });

    const params = new URLSearchParams({
      viewer: 'html',
      pagetype: '',
      format: 'json',
      URN: urn,
    });

    const data = await fetchJson(`${NB_SERVICES}/tilesv2/tilemap?${params}`);
    res.json(data);
  } catch (err) {
    console.error('[tilemap]', err.message);
    res.status(502).json({ error: `Tilemap-feil: ${err.message}` });
  }
});

// ─── Helse-sjekk ───────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true, tid: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\n📚 Bokheimen-proxy kjører på http://localhost:${PORT}`);
  console.log('   Endepunkter:');
  console.log('   GET /api/search?q=&page=&size=');
  console.log('   GET /api/book/:id');
  console.log('   GET /api/tilemap?urn=\n');
});
