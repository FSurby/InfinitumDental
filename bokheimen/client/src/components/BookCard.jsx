import { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import BookCover from './BookCover';
import { storage } from '../utils/storage';

export default function BookCard({ book, onClick }) {
  const [fav, setFav] = useState(() => storage.isFavorite(book.id));

  function handleFav(e) {
    e.stopPropagation();
    storage.toggleFavorite(book.id);
    setFav(f => !f);
  }

  return (
    <article
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
        <BookCover
          src={book.thumbnailSmall}
          title={book.title}
          bookId={book.id}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Lock badge */}
        {!book.isPublic && (
          <div className="absolute top-2 left-2 bg-black/70 text-white rounded-full p-1.5">
            <Lock size={11} />
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/85 hover:bg-white shadow transition-colors"
          title={fav ? 'Fjern fra favoritter' : 'Legg til favoritter'}
        >
          <Heart size={13} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-1 mt-auto">{book.authors}</p>
        {book.year && <p className="text-gray-400 text-xs mt-0.5">{book.year}</p>}
      </div>
    </article>
  );
}
