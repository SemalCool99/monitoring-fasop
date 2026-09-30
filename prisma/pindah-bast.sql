INSERT INTO "Bast" ("pekerjaanId", "urutan", "nomor", "tanggal")
SELECT "id", 1, "nomor_bastp", "tanggal_bastp"
FROM "Pekerjaan"
WHERE "nomor_bastp" IS NOT NULL OR "tanggal_bastp" IS NOT NULL;
