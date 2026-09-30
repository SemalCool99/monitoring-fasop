import { prisma } from "./prisma";

const HARI = 86400000;

export async function sinkronStatus() {
  const semua = await prisma.pekerjaan.findMany({
    include: {
      poTermin: true,
      bast: true,
    },
  });
  const sekarang = Date.now();

  for (const p of semua) {
    if (p.status === "SELESAI") continue;

    let baru: string;
    const akhir = p.tanggal_akhir_kontrak ? p.tanggal_akhir_kontrak.getTime() : null;

    if (p.bast.length > 0) baru = "BAST SELESAI";
    else if (!p.nomor_kontrak && !p.tanggal_awal_kontrak) baru = "BELUM KONTRAK";
    else if (akhir === null) baru = "KONTRAK BERJALAN";
    else if (akhir < sekarang) baru = "TERLAMBAT";
    else if ((akhir - sekarang) / HARI <= 10) baru = "HAMPIR BERAKHIR";
    else baru = "KONTRAK BERJALAN";

    if (baru === "KONTRAK BERJALAN" && p.poTermin.length > 0) {
      baru = "PROSES TAGIHAN";
    }

    if (baru !== p.status) {
      await prisma.pekerjaan.update({ where: { id: p.id }, data: { status: baru } });
    }
  }
}
