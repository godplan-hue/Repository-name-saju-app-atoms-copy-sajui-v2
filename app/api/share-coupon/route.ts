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

    // 같은 번호 중복 방지 (share_coupons 기본 체크)
    const existingSnap = await db.ref(`share_coupons/${cleanPhone}`).once("value");
    if (existingSnap.exists()) {
      return NextResponse.json({ error: "이미 발급된 번호입니다. 번호당 1회만 발급 가능해요." }, { status: 400 });
    }

    // 백업 중복 체크 (sns_share_coupons)
    const backupSnap = await db.ref(`sns_share_coupons/${cleanPhone}`).once("value");
    if (backupSnap.exists()) {
      return NextResponse.json({ error: "이미 발급된 번호입니다. 번호당 1회만 발급 가능해요." }, { status: 400 });
    }

    // 같은 URL 중복 방지 (다른 번호로 동일 게시글 재사용 차단)
    const urlKey = Buffer.from(postUrl).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 60);
    const urlSnap = await db.ref(`share_coupon_urls/${urlKey}`).once("value");
    if (urlSnap.exists()) {
      return NextResponse.json({ error: "이미 등록된 게시글 URL입니다. 새 게시글을 올려주세요." }, { status: 400 });
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
        maxUses: 1,
      });
    }

    // URL 기록 저장 (중복 방지용)
    await db.ref(`share_coupon_urls/${urlKey}`).set({ phone: cleanPhone, postUrl, createdAt: Date.now() });

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
