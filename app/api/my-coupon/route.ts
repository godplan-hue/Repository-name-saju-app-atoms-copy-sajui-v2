import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 전화번호로 발급된 쿠폰 조회 — 고객이 코드를 잊어버렸을 때 사용
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ codes: [] });

  const clean = phone.replace(/\D/g, "");
  if (clean.length < 10) return NextResponse.json({ codes: [] });

  try {
    const results: { code: string; note: string }[] = [];

    // 카카오 공유 쿠폰 조회
    const kakaoSnap = await db
      .ref("kakao_share_coupons")
      .orderByChild("phone")
      .equalTo(clean)
      .once("value");
    const kakaoData = kakaoSnap.val();
    if (kakaoData) {
      for (const entry of Object.values(kakaoData) as { code: string }[]) {
        // promoCodes에서 아직 유효한지 확인
        const codeSnap = await db.ref(`promoCodes/${entry.code}`).once("value");
        const codeData = codeSnap.val();
        if (codeData && codeData.active) {
          results.push({ code: entry.code, note: "카카오 공유 990원 무료쿠폰" });
        }
      }
    }

    // SNS 글쓰기 쿠폰 조회 (sns_share_coupons 경로)
    const snsSnap = await db
      .ref("sns_share_coupons")
      .orderByChild("phone")
      .equalTo(clean)
      .once("value");
    const snsData = snsSnap.val();
    if (snsData) {
      for (const entry of Object.values(snsData) as { code: string; note?: string }[]) {
        const codeSnap = await db.ref(`promoCodes/${entry.code}`).once("value");
        const codeData = codeSnap.val();
        if (codeData && codeData.active) {
          results.push({ code: entry.code, note: entry.note || "SNS 글쓰기 쿠폰" });
        }
      }
    }

    return NextResponse.json({ codes: results });
  } catch {
    return NextResponse.json({ codes: [] });
  }
}
