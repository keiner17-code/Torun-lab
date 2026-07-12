import { NextRequest, NextResponse } from "next/server";
import { syncCosto } from "@/lib/sync";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const resultado = await syncCosto();
    return NextResponse.json({ ok: true, ...resultado });
  } catch (err) {
    console.error("sync-costo falló:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
