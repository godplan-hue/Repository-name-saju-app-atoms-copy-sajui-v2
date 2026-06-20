import { NextRequest, NextResponse } from "next/server";
import { randomBytes, pbkdf2Sync } from "crypto";
import { db } from "@/lib/firebase";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, tier, businessName, paidAmount, discountCode, discountPercent } = await request.json();
    if (!email || !password || !name || !businessName) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const existingEmailSnap = await db.ref("partners").orderByChild("email").equalTo(email).once("value");
    if (existingEmailSnap.exists()) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }

    // 같은 이름으로 이중 가입 방지 — 등급을 바꾸고 싶으면 새로 가입하지 말고
    // 로그인 후 업그레이드를 이용해야 함
    const existingNameSnap = await db.ref("partners").orderByChild("name").equalTo(name).once("value");
    if (existingNameSnap.exists()) {
      return NextResponse.json({ error: "이미 같은 이름으로 가입된 파트너가 있습니다. 등급을 바꾸려면 로그인 후 등급 업그레이드를 이용해주세요." }, { status: 409 });
    }

    const partnerTier = tier || "free";
    const now = new Date().toISOString();
    const partnerRef = await db.ref("partners").push({
      email, password: hashPassword(password), name, phone: phone || "", businessName,
      tier: partnerTier, createdAt: now, feeRenewedAt: now,
    });

    // 가입비 결제내역 기록 — 지금은 실제 결제(토스 등) 연동 전이라 결제 자체는
    // 시뮬레이션이지만, 나중에 실제 결제로 바뀌어도 "누가 언제 얼마 냈는지"를
    // 똑같은 구조로 기록할 수 있도록 미리 만들어둠
    if (partnerTier !== "free") {
      await db.ref(`partners/${partnerRef.key}/payments`).push({
        type: "signup", tier: partnerTier, amount: paidAmount ?? 0, paidAt: new Date().toISOString(),
        couponCode: discountPercent > 0 ? discountCode : null,
        discountPercent: discountPercent || 0,
      });
    }

    return NextResponse.json({ message: "회원가입 성공", partnerId: partnerRef.key, email });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "회원가입 실패" }, { status: 500 });
  }
}
