import { NextRequest, NextResponse } from "next/server";
import { randomBytes, pbkdf2Sync } from "crypto";
import { db } from "@/lib/firebase";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// 코드 1개 = 파트너 1명을 가리키는 고유 식별자. 영문 이름 일부 + 랜덤 숫자로 만들고,
// 이미 쓰이는 코드면 다시 뽑아서 중복을 피함.
async function generateUniqueDiscountCode(name: string): Promise<string> {
  const base = (name.replace(/[^a-zA-Z0-9]/g, "") || "PARTNER").toUpperCase().slice(0, 6) || "PARTNER";
  for (let i = 0; i < 10; i++) {
    const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    const snap = await db.ref(`discountCodes/${candidate}`).once("value");
    if (!snap.exists()) return candidate;
  }
  return `PARTNER${Date.now()}`;
}

const DEFAULT_DISCOUNT_PERCENT = 10;

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, tier } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const existingSnap = await db.ref("partners").orderByChild("email").equalTo(email).once("value");
    if (existingSnap.exists()) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }

    const partnerTier = tier || "free";
    const partnerRef = await db.ref("partners").push({
      email, password: hashPassword(password), name, phone: phone || "",
      tier: partnerTier, createdAt: new Date().toISOString(),
    });

    // 가입 완료 시 해당 파트너용 할인코드를 자동 생성
    const code = await generateUniqueDiscountCode(name);
    await db.ref(`discountCodes/${code}`).set({
      discountPercent: DEFAULT_DISCOUNT_PERCENT, partnerName: name, tierId: partnerTier, active: true,
    });

    return NextResponse.json({
      message: "회원가입 성공", partnerId: partnerRef.key, email, discountCode: code,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "회원가입 실패" }, { status: 500 });
  }
}
