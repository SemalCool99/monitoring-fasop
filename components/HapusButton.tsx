"use client";

import { Trash2 } from "lucide-react";

export default function HapusButton() {
  return (
    <button
      type="submit"
      title="Hapus"
      onClick={(e) => {
        if (!confirm("Yakin ingin menghapus?")) e.preventDefault();
      }}
      className="text-red-600 dark:text-red-400 hover:text-red-800"
    >
      <Trash2 size={16} className="inline" />
    </button>
  );
}