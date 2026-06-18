import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { calculatePartnerSettlement, getPartnerTier } from "@/lib/partnerTiers";

// 할인코드 검증 -> 이번 달 한도 확인 -> 수수료/부가세 뗀 정산액 계산 -> 기록까지 한번에 처리.
// 결제 버튼을 누르는 순간 호출되어 "계산은 즉시, 지급(입금)은 매월 25일"을 구현함.
export async function POST(request: NextRequest) {
  try {
    const { code, originalPrice } = await request.json();
    if (!code || !originalPrice) {
      return NextResponse.json({ success: false, error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const key = String(code).trim().toUpperCase();
    const codeSnap = await db.ref(`discountCodes/${key}`).once("value");
    const discount = codeSnap.val();
    if (!discount || !discount.active) {
      return NextResponse.json({ success: false, error: "유효하지 않은 할인코드입니다." }, { status: 404 });
    }

    const tier = getPartnerTier(discount.tierId);
    if (tier.monthlyLimit !== null) {
      const settlementsSnap = await db.ref("settlements").once("value");
      const all = Object.values(settlementsSnap.val() || {}) as Array<{ partnerName: string; date: string }>;
      const now = new Date();
      const usedThisMonth = all.filter(r => {
        const d = new Date(r.date);
        return r.partnerName === discount.partnerName && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length;
      if (usedThisMonth >= tier.monthlyLimit) {
        return NextResponse.json({ success: false, error: "이 파트너의 이번 달 판매 한도가 모두 차서 코드를 사용할 수 없습니다. 다음 달에 다시 시도해주세요." }, { status: 403 });
      }
    }

    const customerPaid = Math.round(originalPrice * (1 - discount.discountPercent / 100));
    const breakdown = calculatePartnerSettlement(customerPaid, discount.tierId);
    const record = {
      ...breakdown,
      date: new Date().toISOString(),
      partnerName: discount.partnerName,
      discountCode: key,
      customerPaid,
    };
    const ref = await db.ref("settlements").push(record);

    return NextResponse.json({ success: true, id: ref.key, discountPercent: discount.discountPercent, customerPaid, breakdown });
  } catch (error) {
    console.error("Partner checkout error:", error);
    return NextResponse.json({ success: false, error: "정산 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
