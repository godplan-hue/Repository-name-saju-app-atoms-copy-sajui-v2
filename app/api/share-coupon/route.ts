import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const SNS_DOMAINS = [
  "instagram.com", "youtube.com", "youtu.be", "tiktok.com",
  "blog.naver.com", "naver.com", "twitter.com", "x.com",
  "facebook.com", "threads.net", "story.kakao.com",
];

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FREE";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createUniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = genCode();
    const snap = await db.ref(`promoCodes/${candidate}`).once("value");
    if (!snap.exists()) return candidate;
  }
  throw new Error("코드 생성 실패");
}

function isValidSnsUrl(url: string): boolean {
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    return SNS_DOMAINS.some(d => u.hostname.includes(d));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone, postUrl } = await request.json();
    if (!phone) return NextResponse.json({ error: "전화번호를 입력해주세요." }, { status: 400 });
    if (!postUrl || !isValidSnsUrl(postUrl)) {
      return NextResponse.json({ error: "인스타·블로그·유튜브 게시글 URL을 입력해주세요." }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 같은 번호 중복 발급 방지 — 전화번호를 키로 직접 읽기
    const existingSnap = await db.ref(`share_coupons/${cleanPhone}`).once("value");
    if (existingSnap.exists()) {
      return NextResponse.json({ codes: existingSnap.val().codes || [] });
    }

    // 990원 무료쿠폰 5장 발급
    const codes: string[] = [];
    for (let i = 0; i < 5; i++) codes.push(await createUniqueCode());

    for (const code of codes) {
      await db.ref(`promoCodes/${code}`).set({
        discountPercent: 100,
        maxAmount: 990,
        note: "SNS공유무료쿠폰(990원)",
        active: true,
        usageCount: 0,
      });
    }

    // 전화번호를 키로 저장 — 중복 발급 원천 차단
    await db.ref(`share_coupons/${cleanPhone}`).set({
      phone: cleanPhone,
      postUrl,
      codes,
      createdAt: Date.now(),
    });

    // sns_share_coupons: /my-coupon 조회용 (전화번호 키)
    await db.ref(`sns_share_coupons/${cleanPhone}`).set({
      phone: cleanPhone,
      codes,
      note: "SNS 글쓰기 990원 × 5장",
      createdAt: Date.now(),
    });

    return NextResponse.json({ codes });

  } catch (error) {
    console.error("Share coupon error:", error);
    return NextResponse.json({ error: "쿠폰 발급 실패" }, { status: 500 });
  }
}
