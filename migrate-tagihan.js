const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const pekerjaan = await prisma.pekerjaan.findMany({ include: { poTermin: true } });
  let total = 0;
  for (const p of pekerjaan) {
    if (p.poTermin.length > 0) continue; // sudah punya termin, skip
    const tagihan = [p.tagihan_1, p.tagihan_2, p.tagihan_3, p.tagihan_4];
    const buat = [];
    tagihan.forEach((nilai, i) => {
      if (nilai != null) buat.push({ pekerjaanId: p.id, urutan: i + 1, nomor: null, nilai });
    });
    if (buat.length > 0) {
      await prisma.poTermin.createMany({ data: buat });
      total += buat.length;
      console.log(`Pekerjaan #${p.id}: ${buat.length} termin dipindah`);
    }
  }
  console.log(`Selesai. Total termin dibuat: ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());