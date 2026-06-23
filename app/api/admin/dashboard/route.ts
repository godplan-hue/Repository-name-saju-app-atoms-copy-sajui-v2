import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });
    }

    // partnerArchive(분석 보관함) 전체를 매번 다 읽는 대신, 분석 생성 시점에
    // 같이 갱신해두는 가벼운 집계(partnerStats)만 읽음 — 보관함이 수만~수십만
    // 건으로 쌓여도 이 대시보드 로딩 속도는 파트너 수에만 비례해서 그대로 빠름
    const [partnersSnap, statsSnap] = await Promise.all([
      db.ref("partners").once("value"),
      db.ref("partnerStats").once("value"),
    ]);
    const partners = partnersSnap.val() || {};
    const stats = statsSnap.val() || {};

    const totalPartners = Object.keys(partners).length;
    const yyyymm = new Date().toISOString().slice(0, 7);

    let monthlyRevenue = 0;
    let totalAnalysis = 0;
    let topPartner: { name: string; revenue: number } | null = null;

    Object.entries(stats).forEach(([partnerId, s]) => {
      const v = s as any;
      const partnerName = partners[partnerId]?.name || partnerId;
      totalAnalysis += v.total?.count || 0;
      monthlyRevenue += v[yyyymm]?.revenue || 0;
      const revenue = v.total?.revenue || 0;
      if (!topPartner || revenue > topPartner.revenue) topPartner = { name: partnerName, revenue };
    });

    return NextResponse.json({ totalPartners, monthlyRevenue, totalAnalysis, topPartner });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "대시보드 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
