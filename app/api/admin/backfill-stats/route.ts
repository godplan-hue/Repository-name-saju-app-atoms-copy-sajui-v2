import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 1회용 되돌림(backfill) 작업 — partnerStats 집계 시스템을 도입하기 "전에"
// 이미 partnerArchive에 쌓여있던 옛날 분석 기록들은 집계에 한 번도 안 잡혔음.
// 이걸 실행하면 partnerArchive 전체를 한 번 다 읽어서 partnerStats를 처음부터
// 다시 정확하게 채워 넣음. 평소에 반복 실행하는 API가 아니라 "한 번만" 쓰는
// 관리자용 도구라서, 전체를 다 읽어도 괜찮음(매번 읽는 다른 화면들과는 다름)
export async function POST() {
  const archiveSnap = await db.ref("partnerArchive").once("value");
  const archive = archiveSnap.val() || {};

  const newStats: Record<string, Record<string, { count: number; revenue: number }>> = {};

  Object.entries(archive).forEach(([partnerId, entries]) => {
    Object.values(entries as object).forEach((value) => {
      const e = value as any;
      const charge = e.charge?.totalCharge || 0;
      const yyyymm = (e.createdAt || "").slice(0, 7);
      if (!yyyymm) return;

      if (!newStats[partnerId]) newStats[partnerId] = {};
      const total = newStats[partnerId]["total"] || { count: 0, revenue: 0 };
      total.count += 1;
      total.revenue += charge;
      newStats[partnerId]["total"] = total;

      const month = newStats[partnerId][yyyymm] || { count: 0, revenue: 0 };
      month.count += 1;
      month.revenue += charge;
      newStats[partnerId][yyyymm] = month;
    });
  });

  await db.ref("partnerStats").set(newStats);
  return NextResponse.json({ success: true, partnersUpdated: Object.keys(newStats).length });
}
