import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
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

// ─── Tilemap ───────────────────────────────────────────────────────────────
app.get('/api/tilemap', async (req, res) => {
  try {
    const { urn } = req.query;
    if (!urn) return res.status(400).json({ error: 'URN mangler' });
    const params = new URLSearchParams({ viewer: 'html', pagetype: '', format: 'json', URN: urn });
    const data = await fetchJson(`${NB_SERVICES}/tilesv2/tilemap?${params}`);
    res.json(data);
  } catch (err) {
    console.error('[tilemap]', err.message);
    res.status(502).json({ error: `Tilemap-feil: ${err.message}` });
  }
});

// ─── Helse-sjekk ───────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true, tid: new Date().toISOString() }));

// ─── Servér React-appen (produksjon) ───────────────────────────────────────
const clientDist = join(__dirname, '../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA-fallback: alle ikke-API-ruter får index.html
  app.use((req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (_, res) => res.send('Bokheimen proxy kjører. Bygg klienten med: npm run build'));
}

app.listen(PORT, () => {
  console.log(`\n📚 Bokheimen kjører på http://localhost:${PORT}`);
});
