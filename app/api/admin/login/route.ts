import { NextRequest, NextResponse } from "next/server";
import { pbkdf2Sync } from "crypto";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rateLimiter";

// 비밀번호는 평문이 아니라 미리 암호화(salt:hash)된 값으로만 저장 — 코드를
// 보더라도 실제 비밀번호는 알아낼 수 없음
function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return check === hash;
}

const ADMIN_ACCOUNTS = [
  {
    id: "admin1",
    email: "junga6783@gmail.com",
    password: "e04ca527d72b3af8518f262d1260454d:02d4ab989b5d04de245b9e64fea29ff088fb5ecd490a019bd3951c78477812cdaffc2a61a76a4d7ba403bd40cfba72cee3234dd2135312efd8bbd8891e5c882e",
    name: "관리자",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    const rate = checkRateLimit(email);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `로그인 시도가 너무 많습니다. ${rate.remainingMinutes}분 후 다시 시도해주세요.` },
        { status: 429 }
      );
    }

    const admin = ADMIN_ACCOUNTS.find(
      (acc) => acc.email === email && verifyPassword(password, acc.password)
    );

    if (!admin) {
      recordFailedAttempt(email);
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    clearAttempts(email);

    return NextResponse.json({
      adminId: admin.id,
      adminName: admin.name,
      email: admin.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}