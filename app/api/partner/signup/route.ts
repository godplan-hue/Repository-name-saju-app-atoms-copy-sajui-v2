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

    return NextResponse.json({ message: "회원가입 성공", partnerId: partnerRef.key, email });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "회원가입 실패" }, { status: 500 });
  }
}
