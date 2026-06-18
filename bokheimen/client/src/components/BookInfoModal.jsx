import { useState, useEffect } from 'react';
import { X, Heart, BookOpen, Library, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCover from './BookCover';
import { storage } from '../utils/storage';

export default function BookInfoModal({ book, onClose }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(() => storage.isFavorite(book.id));
  const [inLib, setInLib] = useState(() => storage.isInLibrary(book.id));
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function toggleFav() {
    storage.toggleFavorite(book.id);
    setFav(f => !f);
  }

  function toggleLib() {
    if (inLib) { storage.removeFromLibrary(book.id); setInLib(false); }
    else { storage.addToLibrary(book); setInLib(true); }
  }

  function handleRead() {
    storage.addToLibrary(book);
    navigate(`/read/${encodeURIComponent(book.id)}`, { state: { book } });
  }

  const desc = book.description || '';
  const short = desc.length > 220 ? desc.slice(0, 220) + '…' : desc;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FDF8F0] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row">
          {/* Cover */}
          <div className="sm:w-52 sm:min-w-52 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden shrink-0">
            <BookCover
              src={book.thumbnailLarge || book.thumbnailSmall}
              title={book.title}
              bookId={book.id}
              className="w-full h-56 sm:h-full min-h-56"
              imgClassName="w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">{book.title}</h2>
                <p className="text-[#2B6CB0] font-medium text-sm mt-1">{book.authors}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors shrink-0">
                <X size={17} className="text-gray-500" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {book.year && (
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {book.year}
                </span>
              )}
              {book.publisher && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full truncate max-w-[16rem]">
                  {book.publisher}
                </span>
              )}
              {!book.isPublic && (
                <span className="bg-gray-200 text-gray-500 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={9} />Krever innlogging
                </span>
              )}
            </div>

            {/* Description */}
            {desc && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed">{showAll ? desc : short}</p>
                {desc.length > 220 && (
                  <button onClick={() => setShowAll(s => !s)} className="text-[#2B6CB0] text-xs mt-1 hover:underline">
                    {showAll ? 'Vis mindre' : 'Les mer'}
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2">
              {book.isPublic ? (
                <button
                  onClick={handleRead}
                  className="flex items-center justify-center gap-2 bg-[#E07B39] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors"
                >
                  <BookOpen size={16} />Les nå
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-gray-200 text-gray-500 font-medium py-2.5 px-5 rounded-xl">
                  <Lock size={16} />Ikke tilgjengelig fritt
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={toggleLib}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    inLib ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-gray-600 hover:border-emerald-400'
                  }`}
                >
                  <Library size={14} />{inLib ? 'I biblioteket' : 'Legg i bibliotek'}
                </button>
                <button
                  onClick={toggleFav}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    fav ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:border-red-400'
                  }`}
                >
                  <Heart size={14} className={fav ? 'fill-red-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
