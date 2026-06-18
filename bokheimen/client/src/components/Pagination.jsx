import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = buildList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Paginering">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-lg hover:bg-orange-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Forrige side"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-9 text-center text-gray-400 select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-orange-500 text-white shadow'
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
        className="p-2 rounded-lg hover:bg-orange-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Neste side"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function buildList(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const set = [];
  const add = (p) => { if (p >= 0 && p < total && !set.includes(p)) set.push(p); };
  add(0);
  if (cur > 3) set.push('…');
  for (let p = Math.max(1, cur - 2); p <= Math.min(total - 2, cur + 2); p++) add(p);
  if (cur < total - 4) set.push('…');
  add(total - 1);
  return set;
}
