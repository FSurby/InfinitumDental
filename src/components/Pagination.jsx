import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-100 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-gray-400 select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-100'
            }`}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-100 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = [];
  const add = (p) => { if (!pages.includes(p) && p >= 0 && p < total) pages.push(p); };
  add(0);
  if (current > 3) pages.push('…');
  for (let p = Math.max(1, current - 2); p <= Math.min(total - 2, current + 2); p++) add(p);
  if (current < total - 4) pages.push('…');
  add(total - 1);
  return pages;
}
