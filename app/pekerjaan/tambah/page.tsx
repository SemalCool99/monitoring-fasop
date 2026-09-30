import { tambahPekerjaan } from "../actions";
import PoTerminEditor from "../../../components/PoTerminEditor";
import BastEditor from "../../../components/BastEditor";
import Script from "next/script";

const input = "bg-white border border-gray-300 p-2 w-full mt-1 rounded-lg dark:bg-slate-800 dark:border-slate-700";
const label = "block text-sm font-semibold text-gray-600 dark:text-slate-300";

export default function TambahPekerjaan() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Tambah Pekerjaan</h1>
      <form action={tambahPekerjaan} className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <label className={label}>PIC</label>
          <select name="pic" className={input}>
            <option value="">- Pilih PIC -</option>
            <option value="RTU 1">RTU 1</option>
            <option value="RTU 2">RTU 2</option>
            <option value="SCADATEL">SCADATEL</option>
          </select>
        </div>
        <div>
          <label className={label}>Anggaran</label>
          <select name="anggaran" className={input}>
            <option value="">- Pilih Anggaran -</option>
            <option value="AI">AI</option>
            <option value="AO">AO</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={label}>Uraian Pekerjaan *</label>
          <textarea name="uraian_pekerjaan" rows={3} className={input} required />
        </div>
        <div>
          <label className={label}>Nomor RAB</label>
          <input name="nomor_rab" className={input} />
        </div>
        <div>
          <label className={label}>Nilai RAB</label>
          <input name="nilai_rab" type="number" className={input} />
        </div>
        <div>
          <label className={label}>Nilai Kontrak</label>
          <input name="nilai_kontrak" type="number" className={input} />
        </div>
        <div>
          <label className={label}>Jenis Pekerjaan</label>
          <select name="jenis_pekerjaan" className={input}>
            <option value="">- Pilih Jenis -</option>
            <option value="Barang dan Jasa">Barang dan Jasa</option>
            <option value="Barang">Barang</option>
          </select>
        </div>
        <div>
          <label className={label}>Progress Pekerjaan (%)</label>
          <input id="progress" name="progress_pekerjaan" readOnly className={`${input} bg-gray-100 dark:bg-slate-700 cursor-not-allowed`} placeholder="Otomatis terisi" />
        </div>
        <div>
          <label className={label}>Vendor</label>
          <input name="vendor" className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Awal Kontrak</label>
          <input id="tglAwal" name="tanggal_awal_kontrak" type="date" className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Akhir Kontrak</label>
          <input id="tglAkhir" name="tanggal_akhir_kontrak" type="date" className={input} />
        </div>
        <div>
          <label className={label}>Durasi Kontrak (hari)</label>
          <input name="durasi_kontrak" type="number" className={input} />
        </div>
        <div>
          <label className={label}>Nomor Kontrak</label>
          <input name="nomor_kontrak" className={input} />
        </div>
        <div>
          <label className={label}>Nomor Amandemen</label>
          <input name="nomor_amandemen" className={input} />
        </div>
        <div>
          <label className={label}>Tanggal Amandemen</label>
          <input name="tanggal_amandemen" type="date" className={input} />
        </div>
        <BastEditor initial={[]} />
        <div>
          <label className={label}>Purchase Request</label>
          <input name="purchase_request" className={input} />
        </div>
        <PoTerminEditor initial={[]} />
        <div>
          <label className={label}>Status</label>
          <select name="status" className={input}>
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Simpan</button>
          <a href="/pekerjaan" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg dark:bg-slate-800 dark:hover:bg-slate-700">Batal</a>
        </div>
      </form>

      <Script id="hitung-progress">
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
