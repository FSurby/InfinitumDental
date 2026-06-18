import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Heart,
  ZoomIn, ZoomOut, Menu, AlertCircle,
} from 'lucide-react';
import ThumbnailStrip from '../components/ThumbnailStrip';
import Spinner from '../components/Spinner';
import { getBook, getTilemap, parseTilemap, getPageFullUrl, extractBookInfo } from '../api/nb';
import { storage } from '../utils/storage';

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const urn = decodeURIComponent(id);

  // Bokinformasjon – kan komme fra navigasjonsstate (raskere) eller API
  const [book, setBook] = useState(location.state?.book || null);
  const [currentPage, setCurrentPage] = useState(() => storage.getProgress(urn));
  const [totalPages, setTotalPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isFav, setIsFav] = useState(() => storage.isFavorite(urn));

  const [bookLoading, setBookLoading] = useState(!location.state?.book);
  const [tilemapLoading, setTilemapLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [showThumbs, setShowThumbs] = useState(true);

  // ── Last inn bokinformasjon og tilemap ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      if (book) return; // allerede lastet fra state
      try {
        const data = await getBook(urn);
        if (!cancelled) setBook(extractBookInfo(data));
      } catch (e) {
        if (!cancelled) setLoadError(`Kunne ikke laste bokinfo: ${e.message}`);
      } finally {
        if (!cancelled) setBookLoading(false);
      }
    }

    async function loadTilemap() {
      try {
        const data = await getTilemap(urn);
        if (cancelled) return;
        const { totalPages: tp } = parseTilemap(data);
        if (tp > 0) setTotalPages(tp);
      } catch (e) {
        console.warn('[tilemap]', e.message);
        // Tilemap-feil er ikke kritisk – leseren fungerer uten sidetall
      } finally {
        if (!cancelled) setTilemapLoading(false);
      }
    }

    loadBook();
    loadTilemap();
    return () => { cancelled = true; };
  }, [urn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Lagre progress + legg til nylig lest ──────────────────────────────
  useEffect(() => {
    storage.setProgress(urn, currentPage);
  }, [urn, currentPage]);

  useEffect(() => {
    if (book) storage.addToRecent(book);
  }, [book]);

  // ── Navigasjon ─────────────────────────────────────────────────────────
  const goTo = useCallback((p) => {
    if (p < 1) return;
    if (totalPages && p > totalPages) return;
    setCurrentPage(p);
    setPageLoading(true);
    setPageError(false);
  }, [totalPages]);

  const prevPage = useCallback(() => goTo(currentPage - 1), [currentPage, goTo]);
  const nextPage = useCallback(() => goTo(currentPage + 1), [currentPage, goTo]);

  // ── Tastaturnavigasjon ─────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
      else if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.25, 3));
      else if (e.key === '-') setZoom(z => Math.max(z - 0.25, 0.5));
      else if (e.key === '0') setZoom(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextPage, prevPage]);

  function toggleFav() {
    storage.toggleFavorite(urn);
    setIsFav(f => !f);
  }

  // ── Laste-tilstand ─────────────────────────────────────────────────────
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center"><Spinner size="lg" className="mx-auto mb-4" /><p className="text-gray-400">Laster bok…</p></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle size={44} className="text-red-400 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">Kunne ikke laste boken</p>
          <p className="text-gray-400 text-sm mb-6">{loadError}</p>
          <button onClick={() => navigate('/')} className="bg-[#E07B39] hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl">
            Tilbake til biblioteket
          </button>
        </div>
      </div>
    );
  }

  const pageImageUrl = getPageFullUrl(urn, currentPage);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col select-none">
      {/* ── Topp-bar ──────────────────────────────────────────────────────── */}
      <header className="bg-gray-800/95 text-white px-4 py-2.5 flex items-center gap-3 shrink-0 z-20 shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline text-sm">Bibliotek</span>
        </button>

        <div className="flex-1 min-w-0 mx-2">
          {book && (
            <>
              <p className="font-semibold text-sm truncate leading-tight">{book.title}</p>
              <p className="text-gray-400 text-xs truncate">{book.authors}</p>
            </>
          )}
        </div>

        {/* Sideteller */}
        <div className="text-sm shrink-0">
          <span className="font-bold text-white">{currentPage}</span>
          {totalPages
            ? <span className="text-gray-400"> / {totalPages}</span>
            : tilemapLoading && <span className="text-gray-500"> / …</span>}
        </div>

        {/* Zoom */}
        <div className="hidden sm:flex items-center gap-0.5">
          <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-1.5 rounded hover:bg-gray-700" title="Zoom ut (-)">
            <ZoomOut size={15} />
          </button>
          <button onClick={() => setZoom(1)} className="px-1 text-xs text-gray-400 hover:text-white w-10 text-center" title="Tilbakestill (0)">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-1.5 rounded hover:bg-gray-700" title="Zoom inn (+)">
            <ZoomIn size={15} />
          </button>
        </div>

        <button onClick={toggleFav} className="p-1.5 rounded hover:bg-gray-700 transition-colors" title={isFav ? 'Fjern fra favoritter' : 'Legg til favoritter'}>
          <Heart size={17} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
        </button>

        <button onClick={() => setShowThumbs(s => !s)} className="p-1.5 rounded hover:bg-gray-700 transition-colors" title="Vis/skjul sider">
          <Menu size={17} />
        </button>
      </header>

      {/* ── Sidevisning ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-2 py-4 min-h-0">
        {/* Forrige */}
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg"
          title="Forrige side (←)"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Boksidebilde */}
        <div
          className="relative flex items-center justify-center max-h-full"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
        >
          {pageLoading && !pageError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Spinner size="lg" />
            </div>
          )}

          {pageError ? (
            <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-xs shadow-xl">
              <AlertCircle size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-200 font-medium mb-1">Side {currentPage} ikke tilgjengelig</p>
              <p className="text-gray-500 text-sm mb-4">Bildet kunne ikke lastes.</p>
              <button
                onClick={() => { setPageError(false); setPageLoading(true); }}
                className="text-orange-400 hover:text-orange-300 text-sm underline"
              >
                Prøv igjen
              </button>
            </div>
          ) : (
            <img
              key={`${urn}-${currentPage}`}
              src={pageImageUrl}
              alt={`Side ${currentPage}`}
              className={`max-h-[calc(100vh-11rem)] max-w-full object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${pageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setPageLoading(false)}
              onError={() => { setPageLoading(false); setPageError(true); }}
            />
          )}
        </div>

        {/* Neste */}
        <button
          onClick={nextPage}
          disabled={totalPages !== null && currentPage >= totalPages}
          className="absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg"
          title="Neste side (→)"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Mobil-zoom */}
      <div className="sm:hidden flex items-center justify-center gap-3 py-2 text-white">
        <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><ZoomOut size={15} /></button>
        <span className="text-xs text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><ZoomIn size={15} /></button>
      </div>

      {/* ── Miniatyroversikt ──────────────────────────────────────────────── */}
      {showThumbs && (
        <div className="bg-gray-800/95 border-t border-gray-700 shrink-0">
          <ThumbnailStrip
            urn={urn}
            currentPage={currentPage}
            totalPages={totalPages || 0}
            onSelect={(p) => { setCurrentPage(p); setPageLoading(true); setPageError(false); }}
          />
        </div>
      )}
    </div>
  );
}
