import { useEffect, useRef } from 'react';
import { getPageThumbUrl } from '../api/nb';

export default function ThumbnailStrip({ urn, currentPage, totalPages, onSelect }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentPage]);

  const visible = buildVisible(currentPage, totalPages);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto px-4 py-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#9ca3af transparent' }}
    >
      {visible.map(p => (
        <button
          key={p}
          ref={p === currentPage ? activeRef : null}
          onClick={() => onSelect(p)}
          className={`shrink-0 relative rounded-lg overflow-hidden border-2 transition-all duration-150 ${
            p === currentPage
              ? 'border-orange-500 scale-105 shadow-lg'
              : 'border-transparent opacity-60 hover:opacity-90 hover:border-gray-500'
          }`}
          title={`Side ${p}`}
        >
          <img
            src={getPageThumbUrl(urn, p)}
            alt={`Side ${p}`}
            className="w-12 h-16 object-cover bg-gray-700"
            loading="lazy"
          />
          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center leading-4">
            {p}
          </span>
        </button>
      ))}
    </div>
  );
}

function buildVisible(cur, total) {
  if (!total) return Array.from({ length: 20 }, (_, i) => i + 1);
  const s = new Set();
  const add = (a, b) => { for (let p = Math.max(1, a); p <= Math.min(total, b); p++) s.add(p); };
  add(1, 5);
  add(cur - 6, cur + 6);
  add(total - 4, total);
  return [...s].sort((a, b) => a - b);
}
