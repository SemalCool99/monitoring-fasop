"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const PESAN: Record<string, string> = {
  tambah: "Pekerjaan berhasil ditambahkan.",
  edit: "Perubahan berhasil disimpan.",
  hapus: "Pekerjaan berhasil dihapus.",
};

export default function Toast({ kode }: { kode: string | null }) {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    if (!kode) return;
    setTampil(true);
    const t = setTimeout(() => setTampil(false), 4000);
    const url = new URL(window.location.href);
    url.searchParams.delete("sukses");
    const qs = url.searchParams.toString();
    window.history.replaceState({}, "", url.pathname + (qs ? "?" + qs : ""));
    return () => clearTimeout(t);
  }, [kode]);

  if (!kode || !tampil) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
      <CheckCircle2 size={18} />
      <span>{PESAN[kode] ?? "Berhasil."}</span>
      <button onClick={() => setTampil(false)} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}
