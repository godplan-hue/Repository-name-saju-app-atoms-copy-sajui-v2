import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rateLimiter";
import { ADMIN_ACCOUNTS, verifyPassword } from "@/lib/adminAccounts";
import { createAdminToken } from "@/lib/adminAuth";

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
      adminId: createAdminToken(admin.id),
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