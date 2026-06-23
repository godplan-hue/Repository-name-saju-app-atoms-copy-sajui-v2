import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 관리자가 전체 파트너의 고객 보관함을 한 번에 보는 용도.
// partnerArchive를 전체 다 읽으면(once("value")) 분석이 수만~수십만 건
// 쌓였을 때 이 화면이 점점 느려지므로, 파트너별로 최근 50건씩만 읽어옴
// (월별 매출 요약은 partnerStats를 따로 읽어서 정확하게 계산함)
const RECENT_PER_PARTNER = 50;

export async function GET() {
  const [partnersSnap, statsSnap] = await Promise.all([
    db.ref("partners").once("value"),
    db.ref("partnerStats").once("value"),
  ]);
  const partners = partnersSnap.val() || {};
  const stats = statsSnap.val() || {};
  const partnerIds = Object.keys(partners);

  const archiveSnaps = await Promise.all(
    partnerIds.map((id) => db.ref(`partnerArchive/${id}`).orderByKey().limitToLast(RECENT_PER_PARTNER).once("value"))
  );

  const list: any[] = [];
  partnerIds.forEach((partnerId, i) => {
    const entries = archiveSnaps[i].val() || {};
    Object.entries(entries).forEach(([id, value]) => {
      const v = value as any;
      list.push({
        id, partnerId,
        partnerName: v.partnerName || partners[partnerId]?.name || partnerId,
        customerName: v.customerName,
        customerEmail: v.customerEmail,
        customerPhone: v.customerPhone,
        packageType: v.packageType,
        consentGiven: !!v.consentGiven,
        charge: v.charge,
        createdAt: v.createdAt,
      });
    });
  });
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 이번 달 파트너별 매출 요약 — 위 list는 파트너별 최근 50건으로 잘려있어
  // 부정확할 수 있어서, 미리 집계해둔 partnerStats로 정확하게 따로 계산함
  const yyyymm = new Date().toISOString().slice(0, 7);
  const monthlySummary = partnerIds
    .map((partnerId) => {
      const m = stats[partnerId]?.[yyyymm] || { count: 0, revenue: 0 };
      return { partnerName: partners[partnerId]?.name || partnerId, count: m.count, revenue: m.revenue };
    })
    .filter((s) => s.count > 0);

  return NextResponse.json({ customers: list, monthlySummary, truncated: true, recentPerPartner: RECENT_PER_PARTNER });
}
