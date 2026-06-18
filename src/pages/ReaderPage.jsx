import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Heart, ZoomIn, ZoomOut,
  Menu, AlertCircle
} from 'lucide-react';
import ThumbnailStrip from '../components/ThumbnailStrip';
import Spinner from '../components/Spinner';
import { getBook, getManifest, getLargePageUrl, extractBookInfo } from '../api/nb';
import { storage } from '../utils/storage';

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = decodeURIComponent(id);

  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThumbs, setShowThumbs] = useState(true);

  // Load book data and manifest
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBook(bookId);
        const info = extractBookInfo(data);
        if (cancelled) return;
        setBook(info);
        setIsFavorite(storage.isFavorite(bookId));
        storage.addToRecent(info);
        const savedPage = storage.getProgress(bookId);
        setCurrentPage(savedPage);

        try {
          const manifest = await getManifest(bookId);
          if (cancelled) return;
          const canvases = manifest?.sequences?.[0]?.canvases
            || manifest?.items
            || [];
          if (canvases.length > 0) setTotalPages(canvases.length);
        } catch {
          // Manifest failed; we'll discover pages incrementally
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Kunne ikke laste boken');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [bookId]);

  // Persist progress
  useEffect(() => {
    if (bookId && currentPage) storage.setProgress(bookId, currentPage);
  }, [bookId, currentPage]);

  const goTo = useCallback((p) => {
    if (!totalPages || p < 1 || p > totalPages) return;
    setCurrentPage(p);
    setPageLoading(true);
    setPageError(false);
  }, [totalPages]);

  const prevPage = useCallback(() => goTo(currentPage - 1), [currentPage, goTo]);
  const nextPage = useCallback(() => goTo(currentPage + 1), [currentPage, goTo]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
      else if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.25, 3));
      else if (e.key === '-') setZoom(z => Math.max(z - 0.25, 0.5));
      else if (e.key === '0') setZoom(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextPage, prevPage]);

  function toggleFavorite() {
    storage.toggleFavorite(bookId);
    setIsFavorite(!isFavorite);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Laster bok…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold mb-2">Kunne ikke laste boken</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
            Tilbake til biblioteket
          </button>
        </div>
      </div>
    );
  }

  const pageImageUrl = book ? getLargePageUrl(bookId, currentPage) : null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col select-none">
      {/* Top bar */}
      <header className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-3 shrink-0 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline text-sm">Bibliotek</span>
        </button>

        <div className="flex-1 min-w-0 mx-2">
          {book && (
            <div>
              <p className="font-semibold truncate text-sm">{book.title}</p>
              <p className="text-gray-400 text-xs truncate">{book.authors}</p>
            </div>
          )}
        </div>

        {/* Page counter */}
        <div className="text-sm text-gray-300 shrink-0">
          <span className="font-semibold text-white">{currentPage}</span>
          {totalPages && <span className="text-gray-500"> / {totalPages}</span>}
        </div>

        {/* Zoom controls */}
        <div className="hidden sm:flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-1.5 rounded hover:bg-gray-700 transition-colors" title="Zoom ut (-)">
            <ZoomOut size={16} />
          </button>
          <button onClick={() => setZoom(1)} className="p-1.5 rounded hover:bg-gray-700 transition-colors text-xs w-10 text-center" title="Tilbakestill zoom (0)">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-1.5 rounded hover:bg-gray-700 transition-colors" title="Zoom inn (+)">
            <ZoomIn size={16} />
          </button>
        </div>

        <button
          onClick={toggleFavorite}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
          title={isFavorite ? 'Fjern fra favoritter' : 'Legg til favoritter'}
        >
          <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
        </button>

        <button
          onClick={() => setShowThumbs(!showThumbs)}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
          title="Vis/skjul miniatyrbilder"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Page viewer */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-2 py-4 min-h-0">
        {/* Prev button */}
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          title="Forrige side (←)"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Page image */}
        <div
          className="relative max-h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
        >
          {pageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Spinner size="lg" />
            </div>
          )}
          {pageError ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-xs">
              <AlertCircle size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 text-sm">Kunne ikke laste side {currentPage}</p>
              <button
                onClick={() => { setPageError(false); setPageLoading(true); }}
                className="mt-3 text-orange-400 hover:text-orange-300 text-sm underline"
              >
                Prøv igjen
              </button>
            </div>
          ) : (
            pageImageUrl && (
              <img
                key={`${bookId}-${currentPage}`}
                src={pageImageUrl}
                alt={`Side ${currentPage}`}
                className={`max-h-[calc(100vh-12rem)] max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${pageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setPageLoading(false)}
                onError={() => { setPageLoading(false); setPageError(true); }}
              />
            )
          )}
        </div>

        {/* Next button */}
        <button
          onClick={nextPage}
          disabled={totalPages !== null && currentPage >= totalPages}
          className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          title="Neste side (→)"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Mobile zoom controls */}
      <div className="sm:hidden flex items-center justify-center gap-4 pb-2 text-white">
        <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <ZoomOut size={16} />
        </button>
        <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Thumbnail strip */}
      {showThumbs && book && (
        <div className="bg-gray-800/90 backdrop-blur-sm shrink-0 border-t border-gray-700">
          <ThumbnailStrip
            urn={bookId}
            currentPage={currentPage}
            totalPages={totalPages || 50}
            onPageSelect={(p) => { setCurrentPage(p); setPageLoading(true); setPageError(false); }}
          />
        </div>
      )}
    </div>
  );
}
