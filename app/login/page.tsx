"use client";

import { useActionState } from "react";
import { login } from "./actions";

const input =
  "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action={action} className="bg-white rounded-2xl p-8 shadow-2xl w-96 dark:bg-slate-900">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Monitoring FASOP</h1>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <input name="username" placeholder="Username" className={input} required autoComplete="off" />
          <input name="password" type="password" placeholder="Password" className={input} required autoComplete="off" />
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {pending ? "Memproses..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}