import { useState, useEffect } from 'react';
import { X, Heart, BookOpen, Library, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCover from './BookCover';
import { storage } from '../utils/storage';

export default function BookInfoModal({ book, onClose }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(() => storage.isFavorite(book.id));
  const [inLib, setInLib] = useState(() => storage.isInLibrary(book.id));
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function toggleFavorite() {
    storage.toggleFavorite(book.id);
    setFav(!fav);
  }

  function toggleLibrary() {
    if (inLib) {
      storage.removeFromLibrary(book.id);
      setInLib(false);
    } else {
      storage.addToLibrary(book);
      setInLib(true);
    }
  }

  function handleRead() {
    storage.addToLibrary(book);
    navigate(`/read/${encodeURIComponent(book.id)}`);
  }

  const desc = book.description || '';
  const shortDesc = desc.length > 200 ? desc.slice(0, 200) + '…' : desc;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FDF8F0] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Cover */}
          <div className="sm:w-56 sm:min-w-56 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden">
            <BookCover
              src={book.thumbnailLarge || book.thumbnailSmall}
              title={book.title}
              bookId={book.id}
              className="w-full h-64 sm:h-full min-h-64"
              imgClassName="w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">{book.title}</h2>
                <p className="text-blue-600 font-medium mt-1">{book.authors}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {book.year && (
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                  {book.year}
                </span>
              )}
              {book.publisher && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full truncate max-w-xs">
                  {book.publisher}
                </span>
              )}
              {!book.isPublic && (
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Krever innlogging
                </span>
              )}
            </div>

            {desc && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {showFullDesc ? desc : shortDesc}
                </p>
                {desc.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-blue-500 text-xs mt-1 hover:underline"
                  >
                    {showFullDesc ? 'Vis mindre' : 'Les mer'}
                  </button>
                )}
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2">
              {book.isPublic ? (
                <button
                  onClick={handleRead}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  <BookOpen size={18} />
                  Les nå
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
                >
                  <Lock size={18} />
                  Krever innlogging
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={toggleLibrary}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 font-medium text-sm transition-colors ${
                    inLib
                      ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 hover:text-green-600'
                  }`}
                >
                  <Library size={16} />
                  {inLib ? 'I biblioteket' : 'Legg i bibliotek'}
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 font-medium text-sm transition-colors ${
                    fav
                      ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-red-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={16} className={fav ? 'fill-red-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
