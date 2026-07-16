import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SNS_DOMAINS = [
  "instagram.com", "youtube.com", "youtu.be", "tiktok.com",
  "blog.naver.com", "naver.com", "twitter.com", "x.com",
  "facebook.com", "threads.net", "story.kakao.com",
];

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

    // 전화번호 중복 체크
    const existingSnap = await db.ref(`share_coupon_pending/${cleanPhone}`).once("value");
    if (existingSnap.exists()) {
      return NextResponse.json({ error: "이미 신청된 번호입니다. 번호당 1회만 신청 가능해요." }, { status: 400 });
    }
    const approvedSnap = await db.ref(`share_coupons/${cleanPhone}`).once("value");
    if (approvedSnap.exists()) {
      return NextResponse.json({ error: "이미 발급된 번호입니다. 번호당 1회만 신청 가능해요." }, { status: 400 });
    }

    // URL 중복 체크
    const urlKey = Buffer.from(postUrl).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 60);
    const urlSnap = await db.ref(`share_coupon_urls/${urlKey}`).once("value");
    if (urlSnap.exists()) {
      return NextResponse.json({ error: "이미 등록된 게시글 URL입니다. 새 게시글을 올려주세요." }, { status: 400 });
    }

    // URL 기록 저장 (중복 방지)
    await db.ref(`share_coupon_urls/${urlKey}`).set({ phone: cleanPhone, postUrl, createdAt: Date.now() });

    // 신청 대기 저장 (즉시 발급 X)
    await db.ref(`share_coupon_pending/${cleanPhone}`).set({
      phone: cleanPhone,
      postUrl,
      status: "pending",
      createdAt: Date.now(),
    });

    // 에스더님께 이메일 알림
    await resend.emails.send({
      from: "점운 <onboarding@resend.dev>",
      to: "junga6783@gmail.com",
      subject: `📸 SNS 후기 신청이 들어왔어요! (${cleanPhone})`,
      html: `
        <h2>📸 SNS 후기 쿠폰 신청</h2>
        <p><strong>전화번호:</strong> ${cleanPhone}</p>
        <p><strong>게시글 URL:</strong> <a href="${postUrl}">${postUrl}</a></p>
        <p><strong>신청 시각:</strong> ${new Date().toLocaleString("ko-KR")}</p>
        <br/>
        <p>👉 <a href="https://jeomun.com/admin/direct-payments">어드민에서 확인하기</a></p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Share coupon error:", error);
    return NextResponse.json({ error: "신청 실패. 다시 시도해주세요." }, { status: 500 });
  }
}
