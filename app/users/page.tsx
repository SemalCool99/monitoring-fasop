import { prisma } from "../../lib/prisma";
import { tambahUser, hapusUser } from "./actions";
import HapusButton from "../../components/HapusButton";
import { UserPlus } from "lucide-react";

const input = "bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
const th = "p-2 text-left bg-white/5 text-slate-300 border-b border-white/10";

export default async function Users() {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 anim-masuk">Manajemen Users ({users.length})</h1>

      <form action={tambahUser} className="flex flex-wrap gap-2 mb-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 anim-masuk anim-1">
        <input name="username" placeholder="Username baru" className={`${input} flex-1 min-w-[150px]`} required />
        <input name="password" type="password" placeholder="Password" className={`${input} flex-1 min-w-[150px]`} required />
        <select name="role" className={input}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition active:scale-95">
          <UserPlus size={16} /> Tambah
        </button>
      </form>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-x-auto anim-masuk anim-2">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr>
              <th className={th}>ID</th>
              <th className={th}>Username</th>
              <th className={th}>Role</th>
              <th className={`${th} text-center`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/10 text-slate-100">
                <td className="p-2">{u.id}</td>
                <td className="p-2 font-semibold">{u.username}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.role === "ADMIN" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <form action={hapusUser} className="inline">
                    <input type="hidden" name="id" value={u.id} />
                    <HapusButton />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}