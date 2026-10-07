"use server";

import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { bacaSession } from "../../lib/session";

async function wajibAdmin() {
  const s = await bacaSession();
  if (s?.role !== "ADMIN") redirect("/pekerjaan");
}

const angka = (v: FormDataEntryValue | null): number | null => {
  const n = Number(String(v ?? "").trim());
  return String(v ?? "").trim() === "" || isNaN(n) ? null : n;
};
const teks = (v: FormDataEntryValue | null) => (String(v ?? "").trim() === "" ? null : String(v).trim());
const tanggal = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : new Date(s);
};

function ambilData(fd: FormData) {
  return {
    pic: teks(fd.get("pic")),
    uraian_pekerjaan: String(fd.get("uraian_pekerjaan") ?? "").trim(),
    nomor_rab: teks(fd.get("nomor_rab")),
    nilai_rab: angka(fd.get("nilai_rab")),
    nilai_kontrak: angka(fd.get("nilai_kontrak")),
    jenis_pekerjaan: teks(fd.get("jenis_pekerjaan")),
    progress_pekerjaan: teks(fd.get("progress_pekerjaan")),
    vendor: teks(fd.get("vendor")),
    tanggal_awal_kontrak: tanggal(fd.get("tanggal_awal_kontrak")),
    tanggal_akhir_kontrak: tanggal(fd.get("tanggal_akhir_kontrak")),
    durasi_kontrak: angka(fd.get("durasi_kontrak")),
    nomor_kontrak: teks(fd.get("nomor_kontrak")),
    nomor_amandemen: teks(fd.get("nomor_amandemen")),
    tanggal_amandemen: tanggal(fd.get("tanggal_amandemen")),
    purchase_request: teks(fd.get("purchase_request")),
    purchase_order: teks(fd.get("purchase_order")),
    anggaran: teks(fd.get("anggaran")),
    status: teks(fd.get("status")) ?? "BELUM KONTRAK",
    updatedAt: new Date(),
  };
}

function ambilTermin(fd: FormData) {
  const nomor = fd.getAll("po_nomor").map((v) => String(v).trim());
  const nilai = fd.getAll("po_nilai").map((v) => String(v).trim());
  const hasil: { urutan: number; nomor: string | null; nilai: number | null }[] = [];
  for (let i = 0; i < nomor.length; i++) {
    if (!nomor[i] && !nilai[i]) continue;
    hasil.push({
      urutan: hasil.length + 1,
      nomor: nomor[i] || null,
      nilai: nilai[i] !== "" && !isNaN(Number(nilai[i])) ? Number(nilai[i]) : null,
    });
  }
  return hasil;
}

function ambilBast(fd: FormData) {
  const nomor = fd.getAll("bast_nomor").map((v) => String(v).trim());
  const tanggal = fd.getAll("bast_tanggal").map((v) => String(v).trim());
  const hasil: { urutan: number; nomor: string | null; tanggal: Date | null }[] = [];
  for (let i = 0; i < nomor.length; i++) {
    if (!nomor[i] && !tanggal[i]) continue;
    hasil.push({
      urutan: hasil.length + 1,
      nomor: nomor[i] || null,
      tanggal: tanggal[i] !== "" && !isNaN(new Date(tanggal[i]).getTime()) ? new Date(tanggal[i]) : null,
    });
  }
  return hasil;
}

export async function tambahPekerjaan(fd: FormData) {
  await wajibAdmin();
  const data = ambilData(fd);
  if (!data.uraian_pekerjaan) redirect("/pekerjaan/tambah");
  const termin = ambilTermin(fd);
  const bast = ambilBast(fd);
  await prisma.pekerjaan.create({
    data: { ...data, poTermin: { create: termin }, bast: { create: bast } },
  });
  revalidatePath("/pekerjaan");
  redirect("/pekerjaan");
}

export async function updatePekerjaan(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  const data = ambilData(fd);
  const termin = ambilTermin(fd);
  const bast = ambilBast(fd);
  await prisma.pekerjaan.update({
    where: { id },
    data: { ...data, poTermin: { deleteMany: {}, create: termin }, bast: { deleteMany: {}, create: bast } },
  });
  revalidatePath("/pekerjaan");
  redirect(`/pekerjaan/${id}`);
}

export async function hapusPekerjaan(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  await prisma.pekerjaan.delete({ where: { id } });
  revalidatePath("/pekerjaan");
}

export async function ambilDataExport(tahun?: string) {
  await wajibAdmin();

  const semua = await prisma.pekerjaan.findMany({
    orderBy: { id: "desc" },
    include: {
      poTermin: { orderBy: { urutan: "asc" } },
      bast: { orderBy: { urutan: "asc" } },
    },
  });

  const tersaring = tahun && tahun !== ""
    ? semua.filter((p) => {
        const tgl = p.tanggal_awal_kontrak ?? p.createdAt;
        return tgl.getFullYear().toString() === tahun;
      })
    : semua;

  return tersaring.map((p) => ({
    PIC: p.pic ?? "-",
    Anggaran: p.anggaran ?? "-",
    "Uraian Pekerjaan": p.uraian_pekerjaan,
    "Nomor RAB": p.nomor_rab ?? "-",
    "Nilai RAB": p.nilai_rab ?? 0,
    "Nilai Kontrak": p.nilai_kontrak ?? 0,
    "Jenis Pekerjaan": p.jenis_pekerjaan ?? "-",
    "Progress (%)": p.progress_pekerjaan ?? "-",
    Vendor: p.vendor ?? "-",
    "Tanggal Awal Kontrak": p.tanggal_awal_kontrak ? p.tanggal_awal_kontrak.toLocaleDateString("id-ID") : "-",
    "Tanggal Akhir Kontrak": p.tanggal_akhir_kontrak ? p.tanggal_akhir_kontrak.toLocaleDateString("id-ID") : "-",
    "Durasi Kontrak (hari)": p.durasi_kontrak ?? "-",
    "Nomor Kontrak": p.nomor_kontrak ?? "-",
    "Nomor Amandemen": p.nomor_amandemen ?? "-",
    "Tanggal Amandemen": p.tanggal_amandemen ? p.tanggal_amandemen.toLocaleDateString("id-ID") : "-",
    "Daftar BAST": p.bast.length
      ? p.bast.map((b, i) => `${i + 1}. ${b.nomor ?? "-"} (${b.tanggal ? b.tanggal.toLocaleDateString("id-ID") : "-"})`).join("; ")
      : "-",
    "Purchase Request": p.purchase_request ?? "-",
    "Purchase Order": p.purchase_order ?? "-",
    Status: p.status ?? "-",
  }));
}
