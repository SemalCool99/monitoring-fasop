import { prisma } from "../../lib/prisma";
import { Wallet, FileText, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import Grafik from "../../components/Grafik";
import FilterTahunDashboard from "../../components/FilterTahunDashboard";

const rp = (n: number | null | undefined) => "Rp " + (n ?? 0).toLocaleString("id-ID");
const tgl = (d: Date | null) =>
  d ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const fTahun = sp.tahun !== undefined ? sp.tahun : String(new Date().getFullYear());

  const semua = await prisma.pekerjaan.findMany();

  const daftarTahun = [...new Set(
    semua
      .map((p) => (p.tanggal_awal_kontrak ?? p.createdAt).getFullYear())
      .filter((y): y is number => y !== undefined)
  )].sort((a, b) => b - a);

  const tersaring = fTahun && fTahun !== ""
    ? semua.filter((p) => {
        const tgl = p.tanggal_awal_kontrak ?? p.createdAt;
        return tgl.getFullYear().toString() === fTahun;
      })
    : semua;

  const totalRab = tersaring.reduce((a, p) => a + (p.nilai_rab ?? 0), 0);
  const totalKontrak = tersaring.reduce((a, p) => a + (p.nilai_kontrak ?? 0), 0);
  const selesai = tersaring.filter((p) => p.status === "SELESAI").length;
  const aktif = tersaring.length - selesai;

  const perPic = new Map<string, number>();
  tersaring.forEach((p) => perPic.set(p.pic ?? "-", (perPic.get(p.pic ?? "-") ?? 0) + (p.nilai_kontrak ?? 0)));
  const bar = [...perPic.entries()].map(([name, total]) => ({ name, total }));

  const perStatus = new Map<string, number>();
  tersaring.forEach((p) => perStatus.set(p.status ?? "-", (perStatus.get(p.status ?? "-") ?? 0) + 1));
  const pie = [...perStatus.entries()].map(([name, value]) => ({ name, value }));

  const perPicDetail = new Map<string, { jumlah: number; rab: number; kontrak: number }>();
  tersaring.forEach((p) => {
    const k = p.pic ?? "-";
    const cur = perPicDetail.get(k) ?? { jumlah: 0, rab: 0, kontrak: 0 };
    cur.jumlah += 1;
    cur.rab += p.nilai_rab ?? 0;
    cur.kontrak += p.nilai_kontrak ?? 0;
    perPicDetail.set(k, cur);
  });
  const ringkasan = [...perPicDetail.entries()].map(([pic, v]) => ({ pic, ...v }));

  const sekarang = new Date();
  const peringatan = tersaring
    .filter((p) => p.tanggal_akhir_kontrak && p.status !== "SELESAI")
    .map((p) => ({
      p,
      sisa: Math.ceil(((p.tanggal_akhir_kontrak as Date).getTime() - sekarang.getTime()) / 86400000),
    }))
    .filter((x) => x.sisa <= 10)
    .sort((a, b) => a.sisa - b.sisa);

  const kartu = [
    { label: "Total RAB", nilai: rp(totalRab), Icon: Wallet, grad: "from-blue-500 to-indigo-600" },
    { label: "Total Kontrak", nilai: rp(totalKontrak), Icon: FileText, grad: "from-green-500 to-emerald-600" },
    { label: "Pekerjaan Aktif", nilai: String(aktif), Icon: Activity, grad: "from-amber-500 to-orange-600" },
    { label: "Pekerjaan Selesai", nilai: String(selesai), Icon: CheckCircle2, grad: "from-teal-500 to-cyan-600" },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <FilterTahunDashboard tahun={fTahun} daftarTahun={daftarTahun} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kartu.map((k) => (
          <div key={k.label} className={`bg-gradient-to-br ${k.grad} text-white rounded-xl p-4 flex items-center gap-3 shadow-lg`}>
            <k.Icon size={32} className="text-white/80 shrink-0" />
            <div className="min-w-0">
              <p className="text-white/80 text-sm">{k.label}</p>
              <p className="text-xl font-bold break-words">{k.nilai}</p>
            </div>
          </div>
        ))}
      </div>

      {peringatan.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={18} /> Peringatan Kontrak (≤ 10 hari)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200 dark:text-slate-400 dark:border-slate-800">
                  <th className="p-2 text-left">PIC</th>
                  <th className="p-2 text-left">Nama Pekerjaan</th>
                  <th className="p-2 text-left">Akhir Kontrak</th>
                  <th className="p-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {peringatan.map(({ p, sisa }) => (
                  <tr key={p.id} className="border-b border-gray-200 dark:border-slate-800">
                    <td className="p-2">{p.pic}</td>
                    <td className="p-2">{p.uraian_pekerjaan}</td>
                    <td className="p-2 whitespace-nowrap">{tgl(p.tanggal_akhir_kontrak)}</td>
                    <td className="p-2 whitespace-nowrap">
                      <span className={`font-semibold ${sisa < 0 ? "text-red-500" : "text-yellow-500"}`}>
                        {sisa < 0 ? `Lewat ${Math.abs(sisa)} hari` : `Sisa ${sisa} hari`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Grafik bar={bar} pie={pie} />

      <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold mb-2">Ringkasan per PIC</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200 dark:text-slate-400 dark:border-slate-800">
                <th className="p-2 text-left">PIC</th>
                <th className="p-2 text-center">Jumlah Pekerjaan</th>
                <th className="p-2 text-right">Total RAB</th>
                <th className="p-2 text-right">Total Kontrak</th>
              </tr>
            </thead>
            <tbody>
              {ringkasan.map((r) => (
                <tr key={r.pic} className="border-b border-gray-200 dark:border-slate-800">
                  <td className="p-2 font-semibold">{r.pic}</td>
                  <td className="p-2 text-center">{r.jumlah}</td>
                  <td className="p-2 text-right whitespace-nowrap">{rp(r.rab)}</td>
                  <td className="p-2 text-right whitespace-nowrap">{rp(r.kontrak)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
