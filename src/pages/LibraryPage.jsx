import { useState, useEffect } from 'react';
import { Search, BookOpen, Heart, Clock, X, AlertCircle } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookInfoModal from '../components/BookInfoModal';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { searchBooks, extractBookInfo } from '../api/nb';
import { storage } from '../utils/storage';

const FILTERS = [
  { id: 'all', label: 'Alle bøker', icon: BookOpen },
  { id: 'favorites', label: 'Favoritter', icon: Heart },
  { id: 'recent', label: 'Nylig lest', icon: Clock },
];

export default function LibraryPage() {
  const [query, setQuery] = useState('barnebok');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (filter !== 'all') return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchBooks({ query, page, size: 24 });
        if (cancelled) return;
        const items = data?._embedded?.items || [];
        setBooks(items.map(extractBookInfo).filter(Boolean));
        setTotalPages(data?.page?.totalPages || 0);
        setTotalElements(data?.page?.totalElements || 0);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Ukjent feil');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filter, query, page, retryCount]);

  function handleSearch(e) {
    e.preventDefault();
    setQuery(inputValue.trim() || 'barnebok');
    setPage(0);
    setFilter('all');
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setPage(0);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const displayedBooks = (() => {
    if (filter === 'favorites') {
      const favIds = storage.getFavorites();
      const lib = storage.getLibrary();
      return favIds.map(id => lib.find(b => b.id === id)).filter(Boolean);
    }
    if (filter === 'recent') {
      return storage.getRecent();
    }
    return books;
  })();

  const isLocalFilter = filter !== 'all';

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 leading-none">Bokheimen</h1>
                <p className="text-xs text-gray-500 mt-0.5">Barnebøker fra Nasjonalbiblioteket</p>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Søk etter tittel, forfatter eller emne…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                />
                {inputValue && (
                  <button type="button" onClick={() => setInputValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0"
              >
                Søk
              </button>
            </form>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-4">
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleFilterChange(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status line */}
        {!isLocalFilter && !loading && !error && totalElements > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Viser treff for <strong className="text-gray-700">«{query}»</strong> — {totalElements.toLocaleString('nb-NO')} bøker funnet
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" />
            <p className="text-gray-500 animate-pulse">Henter bøker…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <AlertCircle size={48} className="text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-700">Kunne ikke hente bøker</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Prøv igjen
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayedBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <BookOpen size={36} className="text-orange-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {filter === 'favorites' ? 'Ingen favoritter ennå' :
               filter === 'recent' ? 'Ingen leste bøker ennå' :
               'Ingen bøker funnet'}
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              {filter === 'favorites' ? 'Trykk på hjertet på en bok for å legge den til.' :
               filter === 'recent' ? 'Start å lese en bok, så dukker den opp her.' :
               'Prøv et annet søkeord.'}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && displayedBooks.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayedBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>

            {/* Pagination — only for API results */}
            {!isLocalFilter && totalPages > 1 && (
              <div className="mt-10">
                <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Book info modal */}
      {selectedBook && (
        <BookInfoModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
