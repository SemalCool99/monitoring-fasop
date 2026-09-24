"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
      <p className="text-gray-600 dark:text-slate-400 mb-4">{error.message}</p>
      <button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
        Coba Lagi
      </button>
    </div>
  );
}