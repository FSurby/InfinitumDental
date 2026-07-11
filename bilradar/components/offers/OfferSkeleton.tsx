export function OfferCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-8 w-2/3 rounded" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
    </div>
  );
}

export function OfferGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}
