import { NextRequest, NextResponse } from "next/server";
import { pbkdf2Sync } from "crypto";
import { db } from "@/lib/firebase";

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return check === hash;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요" }, { status: 400 });
    }

    const snap = await db.ref("partners").orderByChild("email").equalTo(email).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "등록되지 않은 파트너입니다" }, { status: 401 });
    }

    const all = snap.val();
    const partnerId = Object.keys(all)[0];
    const partnerData = all[partnerId];

    if (!verifyPassword(password, partnerData.password)) {
      return NextResponse.json({ error: "비밀번호가 올바르지 않습니다" }, { status: 401 });
    }

    return NextResponse.json({
      partnerId, partnerName: partnerData.name, partnerTier: partnerData.tier, email: partnerData.email,
    });
  } catch (error) {
    console.error("Partner login error:", error);
    return NextResponse.json({ error: "로그인 중 오류가 발생했습니다" }, { status: 500 });
  }
}
