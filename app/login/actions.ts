"use server";

import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { buatSession, hapusSession } from "../../lib/session";

const percobaan = new Map<string, { count: number; lastAttempt: number; blockedUntil: number }>();

const MAX_PERCOBAAN = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOKIR_MS = 5 * 60 * 1000;

function cekRateLimit(username: string): { boleh: boolean; sisaMenit: number } {
  const now = Date.now();
  const data = percobaan.get(username);
  if (!data) return { boleh: true, sisaMenit: 0 };

  if (now - data.lastAttempt > WINDOW_MS) {
    percobaan.delete(username);
    return { boleh: true, sisaMenit: 0 };
  }

  if (data.blockedUntil > now) {
    return { boleh: false, sisaMenit: Math.ceil((data.blockedUntil - now) / 60000) };
  }

  return { boleh: true, sisaMenit: 0 };
}

function catatKegagalan(username: string) {
  const now = Date.now();
  const data = percobaan.get(username) || { count: 0, lastAttempt: 0, blockedUntil: 0 };
  data.count += 1;
  data.lastAttempt = now;
  if (data.count >= MAX_PERCOBAAN) {
    data.blockedUntil = now + BLOKIR_MS;
    data.count = 0;
  }
  percobaan.set(username, data);
}

export async function login(prevState: any, fd: FormData) {
  const username = String(fd.get("username") || "").trim();
  const password = String(fd.get("password") || "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const { boleh, sisaMenit } = cekRateLimit(username);
  if (!boleh) {
    return { error: `Terlalu banyak percobaan. Coba lagi dalam ${sisaMenit} menit.` };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    catatKegagalan(username);
    return { error: "Username atau password salah." };
  }

  const cocok = user.password.startsWith("$2")
    ? await bcrypt.compare(password, user.password)
    : password === user.password;

  if (!cocok) {
    catatKegagalan(username);
    return { error: "Username atau password salah." };
  }

  percobaan.delete(username);

  if (!user.password.startsWith("$2")) {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
  }

  await buatSession(user.role, user.username);
  redirect("/dashboard");
}

export async function logout() {
  await hapusSession();
  redirect("/login");
}