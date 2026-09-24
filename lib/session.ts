import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-fasop");

export async function buatSession(role: string, username: string) {
  const token = await new SignJWT({ role, username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(SECRET);
  (await cookies()).set("session", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function bacaSession(): Promise<{ role: string; username: string } | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { role: String(payload.role), username: String(payload.username) };
  } catch {
    return null;
  }
}

export async function hapusSession() {
  (await cookies()).delete("session");
}