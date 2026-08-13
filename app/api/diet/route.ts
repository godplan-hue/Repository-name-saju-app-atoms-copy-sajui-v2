import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action } = body;
    if (!userId) return NextResponse.json({ error: "userId 필요" }, { status: 400 });
    const safeId = userId.replace(/[.#$[\]]/g, "_");

    if (action === "lead") {
      const { name, phone, email, birthYear, marketing, createdAt } = body;
      await db.ref(`diet_leads/${safeId}`).set({ name: name || "", phone: phone || "", email: email || "", birthYear: birthYear || null, marketing: marketing ?? false, createdAt: createdAt || Date.now() });
      return NextResponse.json({ ok: true });
    }

    const { date, meals, totalCal, weight } = body;
    if (!date) return NextResponse.json({ error: "필수 파라미터 없음" }, { status: 400 });
    await db.ref(`diet_logs/${safeId}/${date}`).set({ meals, totalCal, weight: weight ?? null, updatedAt: Date.now() });
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
    const snap = await db.ref(`diet_logs/${safeId}`).once("value");
    return NextResponse.json({ data: snap.val() ?? {} });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회 오류" }, { status: 500 });
  }
}
