import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 관리자가 전체 파트너의 고객 보관함을 한 번에 보는 용도
export async function GET() {
  const snap = await db.ref("partnerArchive").once("value");
  const all = snap.val() || {};
  const list: any[] = [];
  Object.entries(all).forEach(([partnerId, entries]) => {
    Object.entries(entries as object).forEach(([id, value]) => {
      const v = value as any;
      list.push({
        id, partnerId,
        partnerName: v.partnerName || partnerId,
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
  return NextResponse.json({ customers: list });
}
