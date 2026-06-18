import { useEffect, useRef } from 'react';
import { getPageUrl } from '../api/nb';

export default function ThumbnailStrip({ urn, currentPage, totalPages, onPageSelect }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentPage]);

  const visiblePages = buildVisiblePages(currentPage, totalPages);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      style={{ scrollbarWidth: 'thin' }}
    >
      {visiblePages.map((p) => (
        <button
          key={p}
          ref={p === currentPage ? activeRef : null}
          onClick={() => onPageSelect(p)}
          className={`shrink-0 relative rounded-lg overflow-hidden transition-all duration-150 ${
            p === currentPage
              ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900 scale-105'
              : 'opacity-60 hover:opacity-90'
          }`}
          title={`Side ${p}`}
        >
          <img
            src={getPageUrl(urn, p)}
            alt={`Side ${p}`}
            className="w-12 h-16 object-cover bg-gray-700"
            loading="lazy"
          />
          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">
            {p}
          </span>
        </button>
      ))}
    </div>
  );
}

function buildVisiblePages(current, total) {
  if (!total) return [];
  const pages = new Set();
  const addRange = (start, end) => {
    for (let p = Math.max(1, start); p <= Math.min(total, end); p++) pages.add(p);
  };
  addRange(1, 5);
  addRange(current - 5, current + 5);
  addRange(total - 4, total);
  return [...pages].sort((a, b) => a - b);
}
