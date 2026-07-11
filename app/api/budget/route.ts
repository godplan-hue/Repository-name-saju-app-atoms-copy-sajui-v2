import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { userId, entries } = await req.json();
    if (!userId || !Array.isArray(entries)) return NextResponse.json({ error: "필수 파라미터 없음" }, { status: 400 });
    const safeId = userId.replace(/[.#$[\]]/g, "_");
    await db.ref(`budget_entries/${safeId}`).set(entries);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "저장 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId 필요" }, { status: 400 });
    const safeId = userId.replace(/[.#$[\]]/g, "_");
    const snap = await db.ref(`budget_entries/${safeId}`).once("value");
    const raw = snap.val();
    return NextResponse.json({ data: Array.isArray(raw) ? raw : [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회 오류" }, { status: 500 });
  }
}
