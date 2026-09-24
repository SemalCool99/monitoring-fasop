"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function gantiTema() {
  const cookieStore = await cookies();
  const tema = cookieStore.get("tema")?.value ?? "dark";
  cookieStore.set("tema", tema === "dark" ? "light" : "dark", { path: "/" });
  const h = await headers();
  redirect(h.get("referer") ?? "/dashboard");
}