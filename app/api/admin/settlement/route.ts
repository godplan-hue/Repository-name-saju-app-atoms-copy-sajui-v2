import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { error: "인증되지 않았습니다" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      settlements: [
        {
          id: "settlement1",
          partnerId: "partner1",
          partnerName: "테스트파트너",
          month: "2026.06",
          revenue: 0,
          fee: 0,
          amount: 0,
          status: "대기중",
        },
      ],
    });
  } catch (error) {
    console.error("Settlement error:", error);
    return NextResponse.json(
      { error: "정산 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}