import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl font-extrabold text-accent">404</div>
      <h1 className="mt-4 text-2xl font-bold">Fant ikke siden</h1>
      <p className="mt-2 max-w-sm text-muted">
        Tilbudet eller siden du lette etter finnes ikke lenger.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-ghost">
          Til forsiden
        </Link>
        <Link href="/tilbud" className="btn-accent">
          Se tilbud
        </Link>
      </div>
    </div>
  );
}
