"use client";

import { Download } from "lucide-react";
import { ambilDataExport } from "../app/pekerjaan/actions";
import * as XLSX from "xlsx";

export default function ExportButton({ tahun }: { tahun: string }) {
  const handleExport = async () => {
    const data = await ambilDataExport(tahun);
    
    if (data.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pekerjaan");
    
    // Auto-size columns
    const maxWidth = Object.keys(data[0] || {}).reduce((acc, key) => {
      const maxLen = Math.max(
        key.length,
        ...data.map((row: any) => String(row[key] || "").length)
      );
      acc[key] = { wch: Math.min(maxLen + 2, 50) };
      return acc;
    }, {} as Record<string, { wch: number }>);
    worksheet["!cols"] = Object.values(maxWidth);
    
    const fileName = `Pekerjaan_${tahun || "Semua"}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      <Download size={16} /> Export Excel
    </button>
  );
}