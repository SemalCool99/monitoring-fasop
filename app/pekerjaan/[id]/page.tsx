import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { bacaSession } from "../../../lib/session";
import Toast from "../../../components/Toast";

const rp = (n: number | null) => "Rp " + (n ?? 0).toLocaleString("id-ID");
const tgl = (d: Date | null) =>
  d ? d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "-";

export default async function DetailPekerjaan({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const p = await prisma.pekerjaan.findUnique({
    where: { id: Number(id) },
    include: {
      poTermin: { orderBy: { urutan: "asc" } },
      bast: { orderBy: { urutan: "asc" } },
    },
  });
  if (!p) notFound();
  const s = await bacaSession();
  const admin = s?.role === "ADMIN";

  const baris: [string, string][] = [
    ["PIC", p.pic ?? "-"],
    ["Anggaran", p.anggaran ?? "-"],
    ["Uraian Pekerjaan", p.uraian_pekerjaan],
    ["Nomor RAB", p.nomor_rab ?? "-"],
    ["Nilai RAB", rp(p.nilai_rab)],
    ["Nilai Kontrak", rp(p.nilai_kontrak)],
    ["Jenis Pekerjaan", p.jenis_pekerjaan ?? "-"],
    ["Progress Pekerjaan", p.progress_pekerjaan ?? "-"],
    ["Vendor", p.vendor ?? "-"],
    ["Awal Kontrak", tgl(p.tanggal_awal_kontrak)],
    ["Akhir Kontrak", tgl(p.tanggal_akhir_kontrak)],
    ["Durasi Kontrak", p.durasi_kontrak ? `${p.durasi_kontrak} hari` : "-"],
    ["Nomor Kontrak", p.nomor_kontrak ?? "-"],
    ["Nomor Amandemen", p.nomor_amandemen ?? "-"],
    ["Tanggal Amandemen", tgl(p.tanggal_amandemen)],
    ["Purchase Request", p.purchase_request ?? "-"],
    ["Status", p.status ?? "-"],
  ];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <Toast kode={sp.sukses ?? null} />
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Detail Pekerjaan</h1>
        <div className="flex gap-2">
          {admin && (
            <Link href={`/pekerjaan/${p.id}/edit`} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              <Pencil size={16} /> Edit
            </Link>
          )}
          <Link href="/pekerjaan" className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-slate-100">
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <table className="w-full text-sm">
          <tbody>
            {baris.map(([k, v]) => (
              <tr key={k} className="border-b border-white/10">
                <td className="p-2 font-semibold w-1/3 text-slate-300">{k}</td>
                <td className="p-2 text-slate-100">{v}</td>
              </tr>
            ))}
            <tr className="border-b border-white/10">
              <td className="p-2 font-semibold w-1/3 text-slate-300 align-top">PO Termin</td>
              <td className="p-2">
                {p.poTermin.length === 0 ? (
                  <span className="text-slate-400">-</span>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="p-1 text-left">#</th>
                        <th className="p-1 text-left">Nomor PO</th>
                        <th className="p-1 text-right">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.poTermin.map((t) => (
                        <tr key={t.id} className="text-slate-100">
                          <td className="p-1">{t.urutan}</td>
                          <td className="p-1">{t.nomor ?? "-"}</td>
                          <td className="p-1 text-right whitespace-nowrap">{rp(t.nilai)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="p-2 font-semibold w-1/3 text-slate-300 align-top">BAST</td>
              <td className="p-2">
                {p.bast.length === 0 ? (
                  <span className="text-slate-400">-</span>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="p-1 text-left">#</th>
                        <th className="p-1 text-left">Nomor BAST</th>
                        <th className="p-1 text-left">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.bast.map((b) => (
                        <tr key={b.id} className="text-slate-100">
                          <td className="p-1">{b.urutan}</td>
                          <td className="p-1">{b.nomor ?? "-"}</td>
                          <td className="p-1 whitespace-nowrap">{tgl(b.tanggal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
            {p.purchase_order && (
              <tr className="border-b border-white/10">
                <td className="p-2 font-semibold w-1/3 text-slate-300">Purchase Order (lama)</td>
                <td className="p-2 text-slate-100">{p.purchase_order}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}