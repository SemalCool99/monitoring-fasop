import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-fasop");

const HALAMAN_PUBLIK = ["/login"];
const HALAMAN_ADMIN = ["/users", "/pekerjaan/tambah"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("session")?.value;

  let payload: { role?: string } | null = null;
  if (token) {
    try {
      const hasil = await jwtVerify(token, SECRET);
      payload = hasil.payload as { role?: string };
    } catch {
      payload = null;
    }
  }

  const login = !!payload;

  if (!login && !HALAMAN_PUBLIK.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (login && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (login && payload?.role !== "ADMIN" && HALAMAN_ADMIN.some((h) => pathname.startsWith(h))) {
    return NextResponse.redirect(new URL("/pekerjaan", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico)$).*)"],
};