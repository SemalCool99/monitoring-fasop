"use client";

import { useActionState } from "react";
import { login } from "./actions";

const input =
  "w-full p-3 border border-slate-700 rounded-lg bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <>
      <div className="bg-animated fixed inset-0 flex items-center justify-center overflow-hidden">
        {/* Orbs */}
        <div className="orb1 absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl pointer-events-none" />
        <div className="orb2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl pointer-events-none" />
        <div className="orb3 absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-700 rounded-full filter blur-3xl pointer-events-none" />

        {/* Card */}
        <form
          action={action}
          className="relative z-10 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl w-96"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Monitoring FASOP</h1>
            <p className="text-slate-400 text-sm mt-1">Masuk ke akun Anda</p>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <input name="username" placeholder="Username" className={input} required autoComplete="off" />
            <input name="password" type="password" placeholder="Password" className={input} required autoComplete="off" />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 transition-colors duration-200 shadow-lg shadow-blue-500/20"
            >
              {pending ? "Memproses..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}