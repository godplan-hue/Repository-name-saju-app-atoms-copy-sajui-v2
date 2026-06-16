import { NextRequest, NextResponse } from "next/server";

const ADMIN_ACCOUNTS = [
  { id: "admin1", email: "admin@test.com", password: "1234", name: "관리자" },
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

    const admin = ADMIN_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (!admin) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

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