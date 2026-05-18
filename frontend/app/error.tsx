'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">
          Bir Hata Oluştu
        </p>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Bir şeyler ters gitti</h1>
        <p className="text-slate-500 mb-8">
          Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
