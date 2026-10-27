import { prisma } from "../../lib/prisma";
import { tambahUser, hapusUser } from "./actions";
import HapusButton from "../../components/HapusButton";
import { UserPlus } from "lucide-react";

const input = "bg-white border border-gray-300 p-2 rounded-lg dark:bg-slate-800 dark:border-slate-700";
const th = "p-2 text-left bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400";

export default async function Users() {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manajemen Users ({users.length})</h1>

      <form action={tambahUser} className="flex flex-wrap gap-2 mb-4 bg-white border border-gray-200 rounded-xl p-4 dark:bg-slate-900 dark:border-slate-800">
        <input name="username" placeholder="Username baru" className={`${input} flex-1 min-w-[150px]`} required />
        <input name="password" type="password" placeholder="Password" className={`${input} flex-1 min-w-[150px]`} required />
        <select name="role" className={input}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <UserPlus size={16} /> Tambah
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-x-auto dark:bg-slate-900 dark:border-slate-800">
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
              <tr key={u.id} className="border-b border-gray-200 dark:border-slate-800">
                <td className="p-2">{u.id}</td>
                <td className="p-2 font-semibold">{u.username}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.role === "ADMIN" ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" : "bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}>
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
