"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const WARNA = ["#ef4444", "#f59e0b", "#14b8a6", "#a855f7", "#3b82f6", "#22c55e"];
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function Grafik({ bar, pie }: { bar: { name: string; total: number }[]; pie: { name: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-2 text-slate-100">Nilai Kontrak per PIC</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => (v / 1e9).toFixed(1) + " M"} fontSize={12} stroke="#94a3b8" />
              <Tooltip formatter={(value) => rp(Number(value))} contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Bar dataKey="total" fill="#3b82f6" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-2 text-slate-100">Komposisi Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80} label={{ fill: "#e2e8f0", fontSize: 12 }}>
                {pie.map((_, i) => (
                  <Cell key={i} fill={WARNA[i % WARNA.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}