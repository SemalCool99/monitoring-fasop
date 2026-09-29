"use client";

export default function FilterTahunDashboard({ tahun, daftarTahun }: { tahun: string; daftarTahun: number[] }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">Tahun:</label>
      <select 
        value={tahun} 
        onChange={(e) => window.location.href = `/dashboard?tahun=${e.target.value}`}
        className="bg-white border border-gray-300 p-2 rounded-lg dark:bg-slate-800 dark:border-slate-700"
      >
        <option value="">Semua Tahun</option>
        {daftarTahun.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
