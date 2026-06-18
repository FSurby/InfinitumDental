import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const COVER_COLORS = [
  'from-blue-300 to-blue-500',
  'from-orange-300 to-orange-500',
  'from-green-300 to-green-500',
  'from-purple-300 to-purple-500',
  'from-pink-300 to-pink-500',
  'from-teal-300 to-teal-500',
  'from-yellow-300 to-yellow-500',
];

function colorForId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

export default function BookCover({ src, title, bookId, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);
  const gradient = colorForId(bookId || title || 'x');
  const initials = (title || '?').slice(0, 2).toUpperCase();

  if (!src || failed) {
    return (
      <div className={`bg-gradient-to-br ${gradient} flex flex-col items-center justify-center ${className}`}>
        <BookOpen className="text-white opacity-70 mb-2" size={32} />
        <span className="text-white font-bold text-lg text-center px-2 leading-tight line-clamp-3">
          {title || initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={`object-cover ${className} ${imgClassName}`}
      onError={() => setFailed(true)}
    />
  );
}
