import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,PATCH,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone")?.replace(/\D/g, "");
  if (!phone) return cors(NextResponse.json(null));
  try {
    const uid = `phone_${phone}`;
    const snap = await db.ref(`diet_logs/${uid}`).once("value");
    return cors(NextResponse.json(snap.val()));
  } catch {
    return cors(NextResponse.json(null));
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body.phone || "").replace(/\D/g, "");
    const date = body.date;
    const data = body.data;
    if (!phone || !date) return cors(NextResponse.json({ error: "missing" }, { status: 400 }));
    const uid = `phone_${phone}`;
    await db.ref(`diet_logs/${uid}/${date}`).update(data);
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    return cors(NextResponse.json({ error: String(e) }, { status: 500 }));
  }
}
