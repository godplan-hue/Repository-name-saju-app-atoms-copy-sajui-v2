import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
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
    const snap = await db.ref(`diet_profiles/${phone}`).once("value");
    return cors(NextResponse.json(snap.val()));
  } catch {
    return cors(NextResponse.json(null));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body.phone || "").replace(/\D/g, "");
    if (!phone) return cors(NextResponse.json({ error: "no phone" }, { status: 400 }));
    await db.ref(`diet_profiles/${phone}`).set({ ...body, phone, savedAt: Date.now() });
    // 무료 리드 저장
    if (body.source === "toss-diet") {
      await db.ref("free_leads").push({
        name: body.name || "",
        phone,
        birthYear: body.birthYear,
        source: "toss-diet",
        marketing: body.marketing || false,
        agreedAt: body.agreedAt || Date.now(),
      });
    }
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    return cors(NextResponse.json({ error: String(e) }, { status: 500 }));
  }
}
