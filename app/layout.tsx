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
    <html lang="id" className={tema === "dark" ? "dark" : ""}>
      <body className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 text-gray-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
        {session ? (
          <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar role={session.role} tema={tema} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
