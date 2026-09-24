"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Termin = { nomor: string; nilai: string };

const input = "bg-white border border-gray-300 p-2 w-full mt-1 rounded-lg dark:bg-slate-800 dark:border-slate-700";

export default function PoTerminEditor({ initial }: { initial: Termin[] }) {
  const [rows, setRows] = useState<Termin[]>(
    initial.length > 0 ? initial : [{ nomor: "", nilai: "" }]
  );

  const set = (i: number, k: keyof Termin, v: string) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [k]: v } : row)));

  const tambah = () => setRows((r) => [...r, { nomor: "", nilai: "" }]);

  const hapus = (i: number) => setRows((r) => r.filter((_, j) => j !== i));

  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-2">
        <span className="block text-sm font-semibold text-gray-600 dark:text-slate-300">PO Termin</span>
        <button
          type="button"
          onClick={tambah}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
        >
          <Plus size={14} /> Tambah Termin
        </button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 dark:text-slate-400">Nomor PO Termin {i + 1}</label>
            <input
              name="po_nomor"
              value={row.nomor}
              onChange={(e) => set(i, "nomor", e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-slate-400">Nilai</label>
            <input
              name="po_nilai"
              type="number"
              value={row.nilai}
              onChange={(e) => set(i, "nilai", e.target.value)}
              className={input}
            />
          </div>
          <button
            type="button"
            onClick={() => hapus(i)}
            title="Hapus termin ini"
            className="text-red-600 dark:text-red-400 hover:text-red-800 p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}