import "./globals.css";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import Sidebar from "../components/Sidebar";
import { sinkronStatus } from "../lib/status";
import { bacaSession } from "../lib/session";

export const metadata = {
  title: "Monitoring FASOP",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await bacaSession();
  const tema = (await cookies()).get("tema")?.value ?? "dark";

  if (session) {
    await sinkronStatus();
  }

  return (
    <html lang="id" className={`${tema === "dark" ? "dark" : ""} h-full`}>
      <body className="h-full m-0 p-0 bg-gradient-to-br from-sky-100 via-white to-indigo-100 text-gray-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 relative">
        <div className="animated-bg" />
        <div className="relative z-10">
          {session ? (
            <div className="flex flex-col md:flex-row min-h-screen">
              <Sidebar role={session.role} tema={tema} />
              <main className="flex-1 p-4 md:p-6 min-h-screen">{children}</main>
            </div>
          ) : (
            children
          )}
        </div>
      </body>
    </html>
  );
}
