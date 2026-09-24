import Link from "next/link";
import { logout } from "../app/login/actions";
import { gantiTema } from "../lib/tema";
import { LayoutDashboard, Briefcase, LogOut, Sun, Moon, Users } from "lucide-react";

export default function Sidebar({ role, tema }: { role: string; tema: string }) {
  return (
    <aside className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-indigo-800 text-white p-4 flex flex-col md:min-h-screen dark:from-slate-900 dark:to-slate-950">
      <h2 className="text-xl font-bold mb-4 md:mb-6 px-2">Monitoring FASOP</h2>
      <nav className="flex md:flex-col flex-wrap gap-1">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link href="/pekerjaan" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800">
          <Briefcase size={18} /> Pekerjaan
        </Link>
        {role === "ADMIN" && (
          <Link href="/users" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800">
            <Users size={18} /> Users
          </Link>
        )}
      </nav>
      <div className="mt-0 md:mt-auto pt-4 md:pt-8 text-sm space-y-3">
        <form action={gantiTema}>
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700">
            {tema === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {tema === "dark" ? "Tema Terang" : "Tema Gelap"}
          </button>
        </form>
        <p className="px-2 text-blue-100 dark:text-slate-400">
          Masuk sebagai: <span className="font-semibold text-white">{role}</span>
        </p>
        <form action={logout}>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full">
            <LogOut size={16} /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}