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
    nomor_bastp: teks(fd.get("nomor_bastp")),
    tanggal_bastp: tanggal(fd.get("tanggal_bastp")),
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

export async function tambahPekerjaan(fd: FormData) {
  await wajibAdmin();
  const data = ambilData(fd);
  if (!data.uraian_pekerjaan) redirect("/pekerjaan/tambah");
  const termin = ambilTermin(fd);
  await prisma.pekerjaan.create({
    data: { ...data, poTermin: { create: termin } },
  });
  revalidatePath("/pekerjaan");
  redirect("/pekerjaan");
}

export async function updatePekerjaan(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  const data = ambilData(fd);
  const termin = ambilTermin(fd);
  await prisma.pekerjaan.update({
    where: { id },
    data: { ...data, poTermin: { deleteMany: {}, create: termin } },
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