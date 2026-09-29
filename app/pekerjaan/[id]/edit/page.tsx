import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import { updatePekerjaan } from "../../actions";
import PoTerminEditor from "../../../../components/PoTerminEditor";
import Script from "next/script";

const input = "bg-white border border-gray-300 p-2 w-full mt-1 rounded-lg dark:bg-slate-800 dark:border-slate-700";
const label = "block text-sm font-semibold text-gray-600 dark:text-slate-300";
const tglIn = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function EditPekerjaan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.pekerjaan.findUnique({
    where: { id: Number(id) },
    include: { poTermin: { orderBy: { urutan: "asc" } } },
  });
  if (!p) notFound();

  const initial = p.poTermin.map((t) => ({
    nomor: t.nomor ?? "",
    nilai: t.nilai != null ? String(t.nilai) : "",
  }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Edit Pekerjaan</h1>
      <form action={updatePekerjaan} className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-slate-900 dark:border-slate-800">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="purchase_order" value={p.purchase_order ?? ""} />
        <div>
          <label className={label}>PIC</label>
          <select name="pic" defaultValue={p.pic ?? ""} className={input}>
            <option value="">- Pilih PIC -</option>
            <option value="RTU 1">RTU 1</option>
            <option value="RTU 2">RTU 2</option>
            <option value="SCADATEL">SCADATEL</option>
          </select>
        </div>
        <div>
          <label className={label}>Anggaran</label>
          <select name="anggaran" defaultValue={p.anggaran ?? ""} className={input}>
            <option value="">- Pilih Anggaran -</option>
            <option value="AI">AI</option>
            <option value="AO">AO</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={label}>Uraian Pekerjaan *</label>
          <textarea name="uraian_pekerjaan" rows={3} defaultValue={p.uraian_pekerjaan} className={input} required />
        </div>
        <div>
          <label className={label}>Nomor RAB</label>
          <input name="nomor_rab" defaultValue={p.nomor_rab ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Nilai RAB</label>
          <input name="nilai_rab" type="number" defaultValue={p.nilai_rab ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Nilai Kontrak</label>
          <input name="nilai_kontrak" type="number" defaultValue={p.nilai_kontrak ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Jenis Pekerjaan</label>
          <select name="jenis_pekerjaan" defaultValue={p.jenis_pekerjaan ?? ""} className={input}>
            <option value="">- Pilih Jenis -</option>
            <option value="Barang dan Jasa">Barang dan Jasa</option>
            <option value="Jasa">Jasa</option>
          </select>
        </div>
        <div>
          <label className={label}>Progress Pekerjaan (%)</label>
          <input id="progress" name="progress_pekerjaan" readOnly defaultValue={p.progress_pekerjaan ?? ""} className={`${input} bg-gray-100 dark:bg-slate-700 cursor-not-allowed`} />
        </div>
        <div>
          <label className={label}>Vendor</label>
          <input name="vendor" defaultValue={p.vendor ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Awal Kontrak</label>
          <input id="tglAwal" name="tanggal_awal_kontrak" type="date" defaultValue={tglIn(p.tanggal_awal_kontrak)} className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Akhir Kontrak</label>
          <input id="tglAkhir" name="tanggal_akhir_kontrak" type="date" defaultValue={tglIn(p.tanggal_akhir_kontrak)} className={input} />
        </div>
        <div>
          <label className={label}>Durasi Kontrak (hari)</label>
          <input name="durasi_kontrak" type="number" defaultValue={p.durasi_kontrak ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Nomor Kontrak</label>
          <input name="nomor_kontrak" defaultValue={p.nomor_kontrak ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Nomor Amandemen</label>
          <input name="nomor_amandemen" defaultValue={p.nomor_amandemen ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Amandemen</label>
          <input name="tanggal_amandemen" type="date" defaultValue={tglIn(p.tanggal_amandemen)} className={input} />
        </div>
        <div>
          <label className={label}>Nomor BASTP</label>
          <input name="nomor_bastp" defaultValue={p.nomor_bastp ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Tanggal BASTP</label>
          <input name="tanggal_bastp" type="date" defaultValue={tglIn(p.tanggal_bastp)} className={input} />
        </div>
        <div>
          <label className={label}>Purchase Request</label>
          <input name="purchase_request" defaultValue={p.purchase_request ?? ""} className={input} />
        </div>
        <PoTerminEditor initial={initial} />
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={p.status ?? ""} className={input}>
            <option value="">- Pilih Status -</option>
            <option value="BELUM KONTRAK">BELUM KONTRAK</option>
            <option value="KONTRAK BERJALAN">KONTRAK BERJALAN</option>
            <option value="HAMPIR BERAKHIR">HAMPIR BERAKHIR</option>
            <option value="TERLAMBAT">TERLAMBAT</option>
            <option value="PROSES TAGIHAN">PROSES TAGIHAN</option>
            <option value="BAST SELESAI">BAST SELESAI</option>
            <option value="SELESAI">SELESAI</option>
          </select>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">Simpan Perubahan</button>
          <a href={`/pekerjaan/${p.id}`} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg dark:bg-slate-800 dark:hover:bg-slate-700">Batal</a>
        </div>
      </form>

      <Script id="hitung-progress-edit">
        {`
          function hitungProgress() {
            var awalEl = document.getElementById('tglAwal');
            var akhirEl = document.getElementById('tglAkhir');
            var progressEl = document.getElementById('progress');
            if (!awalEl || !akhirEl || !progressEl) return;
            if (!awalEl.value || !akhirEl.value) return;
            var tglAwal = new Date(awalEl.value);
            var tglAkhir = new Date(akhirEl.value);
            var sekarang = new Date();
            var totalHari = (tglAkhir - tglAwal) / (1000 * 60 * 60 * 24);
            if (totalHari <= 0) { progressEl.value = '100'; return; }
            var hariBerjalan = (sekarang - tglAwal) / (1000 * 60 * 60 * 24);
            var progress = (hariBerjalan / totalHari) * 100;
            if (progress < 0) progress = 0;
            if (progress > 100) progress = 100;
            progressEl.value = progress.toFixed(1);
          }
          function initProgress() {
            var a = document.getElementById('tglAwal');
            var b = document.getElementById('tglAkhir');
            if (a) a.addEventListener('change', hitungProgress);
            if (b) b.addEventListener('change', hitungProgress);
            hitungProgress();
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProgress);
          } else {
            initProgress();
          }
        `}
      </Script>
    </div>
  );
}