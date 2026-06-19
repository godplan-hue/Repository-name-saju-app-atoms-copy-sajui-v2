import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { error: "인증되지 않았습니다" },
        { status: 401 }
      );
    }

    const [partnersSnap, archiveSnap] = await Promise.all([
      db.ref("partners").once("value"),
      db.ref("partnerArchive").once("value"),
    ]);
    const partners = partnersSnap.val() || {};
    const archive = archiveSnap.val() || {};

    const topSales = Object.entries(partners)
      .map(([partnerId, value]) => {
        const p = value as any;
        const entries = Object.values(archive[partnerId] || {}) as Array<{ charge?: { totalCharge: number } }>;
        return {
          partnerId,
          partnerName: p.name,
          analysisCount: entries.length,
          revenue: entries.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0),
          tier: p.tier || "free",
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((p, i) => ({ rank: i + 1, ...p }));

    return NextResponse.json({ topSales });
  } catch (error) {
    console.error("Top sales error:", error);
    return NextResponse.json(
      { error: "TOP 판매자 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}