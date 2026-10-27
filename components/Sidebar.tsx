"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "../app/login/actions";
import { gantiTema } from "../lib/tema";
import { LayoutDashboard, Briefcase, LogOut, Sun, Moon, Users, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Sidebar({ role, tema }: { role: string; tema: string }) {
  const [ciut, setCiut] = useState(false);

  const item = `flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10 ${ciut ? "justify-center" : ""}`;

  return (
    <aside className={`${ciut ? "md:w-20" : "md:w-64"} w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border-r border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-slate-100 p-4 flex flex-col md:min-h-screen transition-all duration-300`}>
      <div className={`flex items-center mb-4 md:mb-6 px-2 ${ciut ? "justify-center" : "justify-between"}`}>
        {!ciut && (
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 whitespace-nowrap">
            Monitoring FASOP
          </h2>
        )}
        <button
          onClick={() => setCiut(!ciut)}
          title={ciut ? "Perbesar sidebar" : "Perkecil sidebar"}
          className="p-1 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          {ciut ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <nav className="flex md:flex-col flex-wrap gap-1">
        <Link href="/dashboard" className={item} title="Dashboard">
          <LayoutDashboard size={18} /> {!ciut && "Dashboard"}
        </Link>
        <Link href="/pekerjaan" className={item} title="Pekerjaan">
          <Briefcase size={18} /> {!ciut && "Pekerjaan"}
        </Link>
        {role === "ADMIN" && (
          <Link href="/users" className={item} title="Users">
            <Users size={18} /> {!ciut && "Users"}
          </Link>
        )}
      </nav>

      <div className="mt-0 md:mt-auto pt-4 md:pt-8 text-sm space-y-3">
        <form action={gantiTema}>
          <button
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10 text-gray-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-100 ${ciut ? "justify-center" : ""}`}
            title={tema === "dark" ? "Tema Terang" : "Tema Gelap"}
          >
            {tema === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {!ciut && (tema === "dark" ? "Tema Terang" : "Tema Gelap")}
          </button>
        </form>
        {!ciut && (
          <p className="px-2 text-gray-600 dark:text-slate-400">
            Masuk sebagai: <span className="font-semibold text-gray-900 dark:text-white">{role}</span>
          </p>
        )}
        <form action={logout}>
          <button
            className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full ${ciut ? "justify-center" : ""}`}
            title="Logout"
          >
            <LogOut size={16} /> {!ciut && "Logout"}
          </button>
        </form>
      </div>
    </aside>
  );
}
