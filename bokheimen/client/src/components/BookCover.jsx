import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const GRADIENTS = [
  'from-blue-300 to-blue-500',
  'from-orange-300 to-orange-500',
  'from-emerald-300 to-emerald-500',
  'from-purple-300 to-purple-500',
  'from-rose-300 to-rose-500',
  'from-teal-300 to-teal-500',
  'from-yellow-300 to-yellow-500',
  'from-sky-300 to-sky-500',
];

function gradient(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export default function BookCover({ src, title = '', bookId = '', className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`bg-gradient-to-br ${gradient(bookId || title)} flex flex-col items-center justify-center gap-2 p-3 ${className}`}>
        <BookOpen className="text-white/80 shrink-0" size={28} />
        <span className="text-white text-center text-xs font-semibold leading-snug line-clamp-4 px-1">
          {title || '?'}
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
