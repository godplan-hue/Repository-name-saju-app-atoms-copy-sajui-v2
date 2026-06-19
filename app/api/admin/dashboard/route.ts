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

    const totalPartners = Object.keys(partners).length;

    const now = new Date();
    let monthlyRevenue = 0;
    let totalAnalysis = 0;
    const byPartner = new Map<string, { name: string; revenue: number }>();

    Object.entries(archive).forEach(([partnerId, entries]) => {
      const partnerName = partners[partnerId]?.name || partnerId;
      Object.values(entries as object).forEach((value) => {
        const e = value as any;
        totalAnalysis += 1;
        const charge = e.charge?.totalCharge || 0;
        const createdAt = new Date(e.createdAt);
        if (createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth()) {
          monthlyRevenue += charge;
        }
        const prev = byPartner.get(partnerId) || { name: partnerName, revenue: 0 };
        prev.revenue += charge;
        byPartner.set(partnerId, prev);
      });
    });

    let topPartner: { name: string; revenue: number } | null = null;
    byPartner.forEach((v) => {
      if (!topPartner || v.revenue > topPartner.revenue) topPartner = v;
    });

    return NextResponse.json({ totalPartners, monthlyRevenue, totalAnalysis, topPartner });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "대시보드 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
