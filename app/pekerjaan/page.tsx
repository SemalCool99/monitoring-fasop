import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { hapusPekerjaan } from "./actions";
import { bacaSession } from "../../lib/session";
import HapusButton from "../../components/HapusButton";
import ExportButton from "../../components/ExportButton";
import { Plus, Search, Eye, Pencil } from "lucide-react";

const rp = (n: number | null) => (n ? "Rp " + n.toLocaleString("id-ID") : "-");
const tgl = (d: Date | null) =>
  d ? d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "-";

const badge = (s: string | null, warna: Record<string, string>) => {
  const w = warna[s ?? ""] ?? "bg-gray-500/20 text-gray-600 dark:text-gray-400";
  return <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${w}`}>{s}</span>;
};

const badgeSisa = (d: Date | null) => {
  if (!d) return <span className="text-gray-400 dark:text-slate-500">-</span>;
  const s = Math.ceil((d.getTime() - Date.now()) / 86400000);
  const w =
    s < 0 ? "bg-red-500/20 text-red-600 dark:text-red-400"
    : s <= 10 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
    : "bg-green-500/20 text-green-600 dark:text-green-400";
  return <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${w}`}>{s < 0 ? `Lewat ${Math.abs(s)} hr` : `${s} hr`}</span>;
};

const WARNA_STATUS: Record<string, string> = {
  SELESAI: "bg-green-500/20 text-green-600 dark:text-green-400",
  TERLAMBAT: "bg-red-500/20 text-red-600 dark:text-red-400",
  "KONTRAK BERJALAN": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "HAMPIR BERAKHIR": "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  "PROSES TAGIHAN": "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  "BAST SELESAI": "bg-teal-500/20 text-teal-600 dark:text-teal-400",
};

const WARNA_PIC: Record<string, string> = {
  "RTU 1": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "RTU 2": "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  SCADATEL: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
};

const WARNA_ANGGARAN: Record<string, string> = {
  AI: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  AO: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
};

const input = "bg-white border border-gray-300 p-2 rounded-lg dark:bg-slate-800 dark:border-slate-700";
const th = "p-2 text-left sticky top-0 z-10 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400";

export default async function Pekerjaan({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const fPic = sp.pic ?? "";
  const fStatus = sp.status ?? "";
  const fAnggaran = sp.anggaran ?? "";
  
  // Default ke tahun sekarang jika param 'tahun' tidak ada di URL
  const fTahun = sp.tahun !== undefined ? sp.tahun : String(new Date().getFullYear());
  
  const page = Math.max(1, Number(sp.page ?? 1));
  const perPage = 10;

  const s = await bacaSession();
  const admin = s?.role === "ADMIN";
  const semua = await prisma.pekerjaan.findMany({ orderBy: { id: "desc" } });

  const daftarPic = [...new Set(semua.map((p) => p.pic).filter(Boolean))] as string[];
  const daftarStatus = [...new Set(semua.map((p) => p.status).filter(Boolean))] as string[];
  
  const daftarTahun = [...new Set(
    semua
      .map((p) => p.tanggal_awal_kontrak?.getFullYear())
      .filter((y): y is number => y !== undefined)
  )].sort((a, b) => b - a);

  const tersaring = semua.filter(
    (p) =>
      (!q || p.uraian_pekerjaan.toLowerCase().includes(q) || (p.vendor ?? "").toLowerCase().includes(q)) &&
      (!fPic || p.pic === fPic) &&
      (!fStatus || p.status === fStatus) &&
      (!fAnggaran || p.anggaran === fAnggaran) &&
      (!fTahun || p.tanggal_awal_kontrak?.getFullYear().toString() === fTahun)
  );

  const totalNilai = tersaring.reduce((a, p) => a + (p.nilai_kontrak ?? 0), 0);
  const totalPage = Math.max(1, Math.ceil(tersaring.length / perPage));
  const halaman = Math.min(page, totalPage);
  const data = tersaring.slice((halaman - 1) * perPage, halaman * perPage);

  const url = (hal: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (fPic) u.set("pic", fPic);
    if (fStatus) u.set("status", fStatus);
    if (fAnggaran) u.set("anggaran", fAnggaran);
    if (fTahun) u.set("tahun", fTahun);
    u.set("page", String(hal));
    return `/pekerjaan?${u.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Daftar Pekerjaan ({tersaring.length})</h1>
        <div className="flex gap-2">
          {admin && (
            <>
              <ExportButton tahun={fTahun} />
              <Link href="/pekerjaan/tambah" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                <Plus size={16} /> Tambah
              </Link>
            </>
          )}
        </div>
      </div>

      <form method="GET" className="flex flex-wrap gap-2 mb-4">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Cari pekerjaan / vendor..." className={`${input} flex-1 min-w-[200px]`} />
        <select name="pic" defaultValue={fPic} className={input}>
          <option value="">Semua PIC</option>
          {daftarPic.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
        <select name="anggaran" defaultValue={fAnggaran} className={input}>
          <option value="">Semua Anggaran</option>
          <option value="AI">AI</option>
          <option value="AO">AO</option>
        </select>
        <select name="status" defaultValue={fStatus} className={input}>
          <option value="">Semua Status</option>
          {daftarStatus.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
        <select name="tahun" defaultValue={fTahun} className={input}>
          <option value="">Semua Tahun</option>
          {daftarTahun.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Search size={16} /> Cari
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[70vh] overflow-auto dark:bg-slate-900 dark:border-slate-800">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr>
              <th className={th}>PIC</th>
              <th className={`${th} text-center`}>Anggaran</th>
              <th className={th}>Nama Pekerjaan</th>
              <th className={`${th} text-right`}>Nilai Kontrak</th>
              <th className={th}>Awal Kontrak</th>
              <th className={th}>Akhir Kontrak</th>
              <th className={`${th} text-center`}>Sisa Hari</th>
              <th className={th}>Status</th>
              {admin && <th className={`${th} text-center`}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td className="p-2">{badge(p.pic, WARNA_PIC)}</td>
                <td className="p-2 text-center">{badge(p.anggaran, WARNA_ANGGARAN)}</td>
                <td className="p-2">{p.uraian_pekerjaan}</td>
                <td className="p-2 text-right whitespace-nowrap">{rp(p.nilai_kontrak)}</td>
                <td className="p-2 whitespace-nowrap">{tgl(p.tanggal_awal_kontrak)}</td>
                <td className="p-2 whitespace-nowrap">{tgl(p.tanggal_akhir_kontrak)}</td>
                <td className="p-2 text-center">{badgeSisa(p.tanggal_akhir_kontrak)}</td>
                <td className="p-2">{badge(p.status, WARNA_STATUS)}</td>
                {admin && (
                  <td className="p-2 text-center whitespace-nowrap">
                    <Link href={`/pekerjaan/${p.id}`} title="Detail" className="text-blue-600 dark:text-blue-400 mr-2">
                      <Eye size={16} className="inline" />
                    </Link>
                    <Link href={`/pekerjaan/${p.id}/edit`} title="Edit" className="text-green-600 dark:text-green-400 mr-2">
                      <Pencil size={16} className="inline" />
                    </Link>
                    <form action={hapusPekerjaan} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <HapusButton />
                    </form>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={admin ? 9 : 8} className="p-4 text-center text-gray-500 dark:text-slate-500">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Total Nilai Kontrak: <span className="font-semibold text-gray-900 dark:text-white">{rp(totalNilai)}</span>
          </p>
          <div className="flex items-center gap-2">
            {halaman > 1 && <Link href={url(halaman - 1)} className="px-3 py-1 bg-gray-200 rounded-lg dark:bg-slate-800">Sebelumnya</Link>}
            <span className="text-sm text-gray-500 dark:text-slate-400">Halaman {halaman} / {totalPage}</span>
            {halaman < totalPage && <Link href={url(halaman + 1)} className="px-3 py-1 bg-gray-200 rounded-lg dark:bg-slate-800">Berikutnya</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}