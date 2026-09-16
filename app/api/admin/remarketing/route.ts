import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdminToken } from "@/lib/adminAuth";

// 카톡 재발송 대상 DB용 — 일반회원 DB(consumerCustomers) 전체를 가볍게(전화번호·이름만) 읽어옴
// 결제내역/무료DB는 이미 있는 API(/api/admin/direct-payments, /api/admin/free-leads)에서 가져오고
// 여기서는 그 두 곳에 없는 "일반회원(무료 사주 본 사람)" 만 추가로 공급 — 어드민 화면에서 3개를 합쳐 중복 제거함
export async function GET(request: NextRequest) {
  const adminId = verifyAdminToken(request.headers.get("x-admin-id"));
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await db.ref("consumerCustomers").once("value");
  const val = snap.val() || {};
  const customers = Object.entries(val)
    .map(([id, v]: [string, any]) => ({
      id,
      name: v?.name || "",
      phone: v?.phone || "",
      createdAt: v?.createdAt || 0,
    }))
    .filter(c => c.phone);

  return NextResponse.json({ customers });
}
