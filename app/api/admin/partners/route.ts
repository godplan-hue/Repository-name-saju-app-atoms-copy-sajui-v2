import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });
    }

    const [partnersSnap, archiveSnap] = await Promise.all([
      db.ref("partners").once("value"),
      db.ref("partnerArchive").once("value"),
    ]);
    const partners = partnersSnap.val() || {};
    const archive = archiveSnap.val() || {};

    const list = Object.entries(partners).map(([id, value]) => {
      const p = value as any;
      const entries = Object.values(archive[id] || {}) as Array<{ charge?: { totalCharge: number } }>;
      const analysisCount = entries.length;
      const revenue = entries.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0);
      return {
        id,
        name: p.name,
        email: p.email,
        businessName: p.businessName || "",
        tier: p.tier || "free",
        analysisCount,
        revenue,
        createdAt: p.createdAt,
      };
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ partners: list });
  } catch (error) {
    console.error("Partners list error:", error);
    return NextResponse.json({ error: "파트너 목록 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
