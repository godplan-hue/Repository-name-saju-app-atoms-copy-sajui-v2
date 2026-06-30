import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const partnerId = request.nextUrl.searchParams.get("partnerId");
  if (!partnerId) return NextResponse.json({ error: "파트너 ID 필요" }, { status: 400 });
  const snap = await db.ref(`partners/${partnerId}/landing`).once("value");
  return NextResponse.json({ landing: snap.val() ?? null });
}

export async function POST(request: NextRequest) {
  try {
    const { partnerId, landing } = await request.json();
    if (!partnerId) return NextResponse.json({ error: "파트너 ID 필요" }, { status: 400 });
    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    if (!partnerSnap.exists()) return NextResponse.json({ error: "파트너를 찾을 수 없습니다" }, { status: 404 });
    await db.ref(`partners/${partnerId}/landing`).set({ ...landing, updatedAt: Date.now() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Landing save error:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
