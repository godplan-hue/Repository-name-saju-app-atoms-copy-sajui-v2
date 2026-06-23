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

    // partnerArchive 전체를 읽지 않고, 분석 생성 시점에 같이 갱신해두는
    // 가벼운 집계(partnerStats)만 읽음 — 파트너 수에만 비례해서 항상 빠름
    const [partnersSnap, statsSnap] = await Promise.all([
      db.ref("partners").once("value"),
      db.ref("partnerStats").once("value"),
    ]);
    const partners = partnersSnap.val() || {};
    const stats = statsSnap.val() || {};

    const topSales = Object.entries(partners)
      .map(([partnerId, value]) => {
        const p = value as any;
        const total = stats[partnerId]?.total || { count: 0, revenue: 0 };
        return {
          partnerId,
          partnerName: p.name,
          analysisCount: total.count,
          revenue: total.revenue,
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