"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const WARNA = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function Grafik({ bar, pie }: { bar: { name: string; total: number }[]; pie: { name: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold mb-2">Nilai Kontrak per PIC</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis tickFormatter={(v) => (v / 1e9).toFixed(1) + " M"} fontSize={12} />
              <Tooltip formatter={(value) => rp(Number(value))} />
              <Bar dataKey="total" fill="#3b82f6" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold mb-2">Komposisi Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80} label>
                {pie.map((_, i) => (
                  <Cell key={i} fill={WARNA[i % WARNA.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}