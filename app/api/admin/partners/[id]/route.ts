import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [partnerSnap, archiveSnap] = await Promise.all([
      db.ref(`partners/${id}`).once("value"),
      db.ref(`partnerArchive/${id}`).once("value"),
    ]);
    const partner = partnerSnap.val();
    if (!partner) {
      return NextResponse.json({ error: "파트너를 찾을 수 없습니다" }, { status: 404 });
    }
    const entries = Object.values(archiveSnap.val() || {}) as Array<{ charge?: { totalCharge: number } }>;

    return NextResponse.json({
      id,
      name: partner.name,
      email: partner.email,
      businessName: partner.businessName || "",
      tier: partner.tier || "free",
      analysisCount: entries.length,
      revenue: entries.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0),
      createdAt: partner.createdAt,
    });
  } catch (error) {
    console.error("Partner detail error:", error);
    return NextResponse.json(
      { error: "파트너 상세 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });
    }
    const { id } = await params;
    await Promise.all([
      db.ref(`partners/${id}`).remove(),
      db.ref(`partnerArchive/${id}`).remove(),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partner delete error:", error);
    return NextResponse.json(
      { error: "파트너 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}