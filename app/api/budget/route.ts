import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action } = body;
    if (!userId) return cors(NextResponse.json({ error: "userId 필요" }, { status: 400 }));
    const safeId = userId.replace(/[.#$[\]]/g, "_");

    if (action === "lead") {
      const { name, phone, email, marketing, createdAt } = body;
      if (!isFakePhone(phone)) {
        const existingSnap = await db.ref(`budget_leads/${safeId}`).once("value");
        const existing = existingSnap.val() || {};
        await db.ref(`budget_leads/${safeId}`).set({
          name: name || existing.name || "",
          phone: phone || existing.phone || "",
          email: email || existing.email || "",
          marketing: marketing ?? existing.marketing ?? false,
          createdAt: existing.createdAt || createdAt || Date.now(),
        });
      }
      return cors(NextResponse.json({ ok: true }));
    }

    const { entries } = body;
    if (!Array.isArray(entries)) return cors(NextResponse.json({ error: "entries 필요" }, { status: 400 }));
    await db.ref(`budget_entries/${safeId}`).set(entries);
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "저장 오류" }, { status: 500 }));
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return cors(NextResponse.json({ error: "userId 필요" }, { status: 400 }));
    const safeId = userId.replace(/[.#$[\]]/g, "_");
    const snap = await db.ref(`budget_entries/${safeId}`).once("value");
    const raw = snap.val();
    return cors(NextResponse.json({ data: Array.isArray(raw) ? raw : [] }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "조회 오류" }, { status: 500 }));
  }
}
