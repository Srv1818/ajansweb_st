import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-slate-100 select-none mb-2">404</p>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Sayfa Bulunamadı</h1>
        <p className="text-slate-500 mb-8">
          Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}
