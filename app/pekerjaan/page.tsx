import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { hapusPekerjaan } from "./actions";
import { bacaSession } from "../../lib/session";
import HapusButton from "../../components/HapusButton";
import ExportButton from "../../components/ExportButton";
import Toast from "../../components/Toast";
import { Plus, Search, Eye, Pencil } from "lucide-react";

const rp = (n: number | null) => (n ? "Rp " + n.toLocaleString("id-ID") : "-");
const tgl = (d: Date | null) =>
  d ? d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "-";

const badge = (s: string | null, warna: Record<string, string>) => {
  const w = warna[s ?? ""] ?? "bg-gray-500/20 text-gray-600 dark:text-gray-400";
  return <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${w}`}>{s}</span>;
};

const badgeSisa = (d: Date | null, status: string | null) => {
  if (status === "SELESAI" || status === "BAST SELESAI")
    return <span className="text-slate-500">-</span>;
  if (!d) return <span className="text-slate-500">-</span>;
  const s = Math.ceil((d.getTime() - Date.now()) / 86400000);
  const w =
    s < 0 ? "bg-red-500/20 text-red-400"
    : s <= 10 ? "bg-yellow-500/20 text-yellow-400"
    : "bg-green-500/20 text-green-400";
  return <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${w}`}>{s < 0 ? `Lewat ${Math.abs(s)} hr` : `${s} hr`}</span>;
};

const WARNA_STATUS: Record<string, string> = {
  SELESAI: "bg-green-500/20 text-green-400",
  TERLAMBAT: "bg-red-500/20 text-red-400",
  "KONTRAK BERJALAN": "bg-blue-500/20 text-blue-400",
  "HAMPIR BERAKHIR": "bg-yellow-500/20 text-yellow-400",
  "PROSES TAGIHAN": "bg-purple-500/20 text-purple-400",
  "BAST SELESAI": "bg-teal-500/20 text-teal-400",
};

const WARNA_PIC: Record<string, string> = {
  "RTU 1": "bg-blue-500/20 text-blue-400",
  "RTU 2": "bg-indigo-500/20 text-indigo-400",
  SCADATEL: "bg-cyan-500/20 text-cyan-400",
};

const WARNA_ANGGARAN: Record<string, string> = {
  AI: "bg-emerald-500/20 text-emerald-400",
  AO: "bg-orange-500/20 text-orange-400",
};

const input = "bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
const th = "p-2 text-left sticky top-0 z-20 bg-white/5 text-slate-300 border-b border-white/10";
const td = "p-2 border-b border-white/10 text-slate-100";

export default async function Pekerjaan({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const fPic = sp.pic ?? "";
  const fStatus = sp.status ?? "";
  const fAnggaran = sp.anggaran ?? "";
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
      .map((p) => (p.tanggal_awal_kontrak ?? p.createdAt).getFullYear())
      .filter((y): y is number => y !== undefined)
  )].sort((a, b) => b - a);

  const tersaring = semua.filter(
    (p) =>
      (!q || p.uraian_pekerjaan.toLowerCase().includes(q) || (p.vendor ?? "").toLowerCase().includes(q)) &&
      (!fPic || p.pic === fPic) &&
      (!fStatus || p.status === fStatus) &&
      (!fAnggaran || p.anggaran === fAnggaran) &&
      (!fTahun || (p.tanggal_awal_kontrak ?? p.createdAt).getFullYear().toString() === fTahun)
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
    <div className="min-h-screen p-4">
      <Toast kode={sp.sukses ?? null} />
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 anim-masuk">Daftar Pekerjaan ({tersaring.length})</h1>
        <div className="flex gap-2">
          {admin && (
            <>
              <ExportButton tahun={fTahun} />
              <Link href="/pekerjaan/tambah" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition active:scale-95">
                <Plus size={16} /> Tambah
              </Link>
            </>
          )}
        </div>
      </div>

      <form method="GET" className="flex flex-wrap gap-2 mb-4 anim-masuk anim-1">
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
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition active:scale-95">
          <Search size={16} /> Cari
        </button>
      </form>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 max-h-[70vh] overflow-auto anim-masuk anim-2">
        <table className="w-full text-sm min-w-[900px] border-separate border-spacing-0">
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
            {data.map((p, i) => (
              <tr key={p.id} className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10 anim-masuk" style={{ animationDelay: `${0.2 + i * 0.04}s` }}>
                <td className={td}>{badge(p.pic, WARNA_PIC)}</td>
                <td className={`${td} text-center`}>{badge(p.anggaran, WARNA_ANGGARAN)}</td>
                <td className={td}>{p.uraian_pekerjaan}</td>
                <td className={`${td} text-right whitespace-nowrap`}>{rp(p.nilai_kontrak)}</td>
                <td className={`${td} whitespace-nowrap`}>{tgl(p.tanggal_awal_kontrak)}</td>
                <td className={`${td} whitespace-nowrap`}>{tgl(p.tanggal_akhir_kontrak)}</td>
                <td className={`${td} text-center`}>{badgeSisa(p.tanggal_akhir_kontrak, p.status)}</td>
                <td className={td}>{badge(p.status, WARNA_STATUS)}</td>
                {admin && (
                  <td className={`${td} text-center whitespace-nowrap`}>
                    <Link href={`/pekerjaan/${p.id}`} title="Detail" className="text-blue-400 mr-2 inline-flex transition-transform duration-200 hover:scale-125">
                      <Eye size={16} className="inline" />
                    </Link>
                    <Link href={`/pekerjaan/${p.id}/edit`} title="Edit" className="text-green-400 mr-2 inline-flex transition-transform duration-200 hover:scale-125">
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
                <td colSpan={admin ? 9 : 8} className="p-4 text-center text-slate-400">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
          <p className="text-sm text-slate-400">
            Total Nilai Kontrak: <span className="font-semibold text-slate-100">{rp(totalNilai)}</span>
          </p>
          <div className="flex items-center gap-2">
            {halaman > 1 && <Link href={url(halaman - 1)} className="px-3 py-1 bg-white/10 rounded-lg text-slate-100">Sebelumnya</Link>}
            <span className="text-sm text-slate-400">Halaman {halaman} / {totalPage}</span>
            {halaman < totalPage && <Link href={url(halaman + 1)} className="px-3 py-1 bg-white/10 rounded-lg text-slate-100">Berikutnya</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}