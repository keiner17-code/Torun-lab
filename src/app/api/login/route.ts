import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, createSessionToken, verifyPin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const pin = String(form.get("pin") ?? "");
  const next = String(form.get("next") ?? "/monitor");

  const destino = next.startsWith("/") ? next : "/monitor";

  if (!verifyPin(pin)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "1");
    if (destino !== "/monitor") url.searchParams.set("next", destino);
    return NextResponse.redirect(url, { status: 303 });
  }

  const { token, maxAgeSeconds } = await createSessionToken();
  const res = NextResponse.redirect(new URL(destino, req.url), { status: 303 });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  });
  return res;
}
