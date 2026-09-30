"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const input = "bg-white border border-gray-300 p-2 w-full mt-1 rounded-lg dark:bg-slate-800 dark:border-slate-700";

type Baris = { nomor: string; tanggal: string };

export default function BastEditor({ initial }: { initial: Baris[] }) {
  const [rows, setRows] = useState<Baris[]>(initial);

  const ubah = (i: number, field: keyof Baris, value: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };
  const tambah = () => setRows((r) => [...r, { nomor: "", tanggal: "" }]);
  const hapus = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300">BAST (Nomor & Tanggal)</label>
        <button type="button" onClick={tambah} className="flex items-center gap-1 text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg">
          <Plus size={14} /> Tambah BAST
        </button>
      </div>
      {rows.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Belum ada BAST. Klik "Tambah BAST" untuk menambah baris.</p>}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
          <input
            name="bast_nomor"
            value={row.nomor}
            onChange={(e) => ubah(i, "nomor", e.target.value)}
            placeholder={`Nomor BAST #${i + 1}`}
            className={input}
          />
          <input
            name="bast_tanggal"
            type="date"
            value={row.tanggal}
            onChange={(e) => ubah(i, "tanggal", e.target.value)}
            className={input}
          />
          <button type="button" onClick={() => hapus(i)} className="text-red-500 hover:text-red-600 p-2" title="Hapus baris">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
