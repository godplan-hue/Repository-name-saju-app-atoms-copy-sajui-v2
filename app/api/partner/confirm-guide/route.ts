import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { partnerId } = await request.json();
    if (!partnerId) {
      return NextResponse.json({ error: "partnerId가 필요합니다" }, { status: 400 });
    }
    await db.ref(`partners/${partnerId}/guideConfirmedAt`).set(new Date().toISOString());
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Partner guide confirm error:", error);
    return NextResponse.json({ error: "처리 중 오류가 발생했습니다" }, { status: 500 });
  }
}
