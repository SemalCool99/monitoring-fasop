"use server";

import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { bacaSession } from "../../lib/session";

async function wajibAdmin() {
  const s = await bacaSession();
  if (s?.role !== "ADMIN") redirect("/pekerjaan");
}

export async function tambahUser(fd: FormData) {
  await wajibAdmin();
  const username = String(fd.get("username") || "").trim();
  const password = String(fd.get("password") || "");
  const role = String(fd.get("role") || "USER");

  if (!username || !password) redirect("/users");

  const ada = await prisma.user.findUnique({ where: { username } });
  if (ada) redirect("/users");

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, password: hash, role } });
  revalidatePath("/users");
  redirect("/users");
}

export async function hapusUser(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  const s = await bacaSession();
  const diri = await prisma.user.findUnique({ where: { username: s?.username ?? "" } });
  if (diri?.id === id) redirect("/users");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
  redirect("/users");
}