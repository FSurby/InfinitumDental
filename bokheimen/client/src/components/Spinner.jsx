export default function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${sz} animate-spin rounded-full border-4 border-orange-200 border-t-orange-500 ${className}`} />
  );
}
